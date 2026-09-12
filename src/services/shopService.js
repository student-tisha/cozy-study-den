import { mockShopItems } from '../data/mockShop';

const DELAY_NORMAL_MS = 500;
const DELAY_SLOW_MS = 2500;

// Later: return fetch('/api/shop').then(res => res.json())
export function fetchShopItems({ simulate = 'normal' } = {}) {
  if (simulate === 'error') {
    return new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Could not reach the shop.')), DELAY_NORMAL_MS);
    });
  }

  const delay = simulate === 'slow' ? DELAY_SLOW_MS : DELAY_NORMAL_MS;
  const data = simulate === 'empty' ? [] : mockShopItems;
  return new Promise((resolve) => setTimeout(() => resolve(data), delay));
}
