export interface Product {
  id: any;
  name: string;
  description: string;
  price: string;
  image: string;
  badge?: string;
  order_index?: number;
}

export interface PromoSettings {
  id?: string | number;
  event_name: string;
  discount_percentage: number;
  start_date: string;
  end_date: string;
  end_time?: string; // Format: HH:mm
  is_active: boolean;
}

export interface Order {
  id: any;
  created_at: string;
  customer_phone: string;
  customer_address: string;
  product_name: string;
  quantity: number;
  total_price: number;
  payment_method: string;
  status: 'pending' | 'completed' | 'cancelled' | 'paid';
}
