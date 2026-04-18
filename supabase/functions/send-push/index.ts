import { createClient } from 'npm:@supabase/supabase-js';
import { JWT } from 'npm:google-auth-library';

// Initialize Supabase Client
const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
const supabase = createClient(supabaseUrl, supabaseKey);

// Define CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Function to get Google OAuth2 Access Token
async function getAccessToken(serviceAccount: any): Promise<string> {
  const jwtClient = new JWT({
    email: serviceAccount.client_email,
    key: serviceAccount.private_key,
    scopes: ['https://www.googleapis.com/auth/cloud-platform'],
  });
  const tokens = await jwtClient.authorize();
  if (!tokens.access_token) {
    throw new Error('Failed to get access token');
  }
  return tokens.access_token;
}

Deno.serve(async (req) => {
  // Handle CORS Preflight request
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  console.log("🚀 [Push] Request received");

  try {
    const { title, message, image } = await req.json();
    console.log(`📝 [Push] Content: ${title} | ${message} | Image: ${image || 'None'}`);

    if (!title || !message) {
      return new Response(JSON.stringify({ error: 'Title and message are required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Load Service Account
    const serviceAccountStr = Deno.env.get('FIREBASE_SERVICE_ACCOUNT');
    if (!serviceAccountStr) {
      console.error("❌ [Push] FIREBASE_SERVICE_ACCOUNT not found in environment variables");
      throw new Error("Missing FIREBASE_SERVICE_ACCOUNT variable");
    }
    
    console.log("📦 [Push] Service account found. Parsing...");
    const serviceAccount = JSON.parse(serviceAccountStr);

    // Get Access Token
    console.log("🔑 [Push] Generating Access Token for project:", serviceAccount.project_id);
    const accessToken = await getAccessToken(serviceAccount);
    console.log("✅ [Push] Access Token generated successfully");

    // Fetch Tokens
    const { data: tokensData, error: dbError } = await supabase.from('fcm_tokens').select('token');
    if (dbError) throw dbError;

    const tokens = tokensData?.map(t => t.token) || [];
    console.log(`📱 [Push] Targeting ${tokens.length} devices`);

    if (tokens.length === 0) {
      return new Response(JSON.stringify({ success: true, message: 'No tokens found.' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const projectId = serviceAccount.project_id;
    const fcmUrl = `https://fcm.googleapis.com/v1/projects/${projectId}/messages:send`;

    // FCM v1 doesn't have a native "multicast" endpoint that returns per-token status in one go as easily as legacy 
    // but the modern way is to send them in parallel or use a loop.
    // For simplicity and to ensure we can cleanup failed tokens, we'll send them individually in parallel.
    
    console.log("📤 [Push] Blasting notifications...");
    const results = await Promise.all(
      tokens.map(async (token) => {
        try {
          const res = await fetch(fcmUrl, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${accessToken}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              message: {
                token: token,
                notification: { 
                  title, 
                  body: message,
                  image: image || undefined
                },
                data: {
                  title,
                  message,
                  image: image || ""
                },
                android: { 
                  priority: "high",
                  notification: {
                    image: image || undefined,
                    sound: "default"
                  }
                },
                apns: {
                  payload: {
                    aps: {
                      'mutable-content': 1
                    }
                  },
                  fcm_options: {
                    image: image || undefined
                  }
                }
              },
            }),
          });
          const data = await res.json();
          return { token, ok: res.ok, status: res.status, data };
        } catch (e) {
          return { token, ok: false, error: e.message };
        }
      })
    );

    const successCount = results.filter(r => r.ok).length;
    const failureCount = results.length - successCount;
    console.log(`✅ [Push] Done. Success: ${successCount}, Failures: ${failureCount}`);

    // Cleanup failed tokens (invalid or unregistered)
    const tokensToDelete = results
      .filter(r => !r.ok && (r.data?.error?.status === 'NOT_FOUND' || r.status === 404 || r.status === 410))
      .map(r => r.token);

    if (tokensToDelete.length > 0) {
      console.log(`🧹 [Push] Cleaning up ${tokensToDelete.length} stale tokens`);
      await supabase.from('fcm_tokens').delete().in('token', tokensToDelete);
    }

    return new Response(JSON.stringify({ 
      success: true, 
      sent: successCount, 
      failed: failureCount 
    }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error: any) {
    console.error("💥 [Push] Error:", error.message);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
