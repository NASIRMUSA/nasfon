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
  is_active: boolean;
}
