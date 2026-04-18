import type { PromoSettings } from '../types';

export const isPromoActive = (promoSettings: PromoSettings | null | undefined): boolean => {
  if (!promoSettings || !promoSettings.is_active) return false;
  const now = new Date();
  const start = new Date(promoSettings.start_date);
  const endDateTimeStr = `${promoSettings.end_date}T${promoSettings.end_time || '23:59:59'}`;
  const end = new Date(endDateTimeStr);
  return now >= start && now <= end;
};

export const getDiscountedPrice = (price: string, promoSettings: PromoSettings | null | undefined): string => {
  const activePromo = isPromoActive(promoSettings);
  if (!activePromo || !promoSettings) return price;
  const numericPrice = parseFloat(price.replace(/,/g, ''));
  const discounted = numericPrice * (1 - (promoSettings.discount_percentage / 100));
  return discounted.toLocaleString(undefined, { maximumFractionDigits: 0 });
};
