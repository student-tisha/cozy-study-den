// Each item's `category` maps to exactly one equip slot on the
// companion (state.equipped.<category>) — see shopLogic.js.
// The extra visual fields (potColor/flowerColor/bg) are what
// Companion.jsx reads to actually change how the plant looks.
export const mockShopItems = [
  { id: 'pot-terracotta', category: 'pot', name: 'Terracotta Pot', price: 40, emoji: '🪴', potColor: '#C97B4A' },
  { id: 'pot-ceramic', category: 'pot', name: 'Ceramic Pot', price: 60, emoji: '🏺', potColor: '#9FB6C9' },

  { id: 'bg-sunrise', category: 'background', name: 'Sunrise Glow', price: 50, emoji: '🌅', bg: 'linear-gradient(135deg, #FDE9C8, #FFFCF7)' },
  { id: 'bg-meadow', category: 'background', name: 'Meadow Mist', price: 50, emoji: '🌾', bg: 'linear-gradient(135deg, #E3EEDF, #FFFCF7)' },

  { id: 'acc-bow', category: 'accessory', name: 'Little Bow', price: 25, emoji: '🎀' },
  { id: 'acc-glasses', category: 'accessory', name: 'Tiny Sunglasses', price: 30, emoji: '🕶️' },

  { id: 'deco-butterfly', category: 'decoration', name: 'Butterfly Friend', price: 20, emoji: '🦋' },
  { id: 'deco-ladybug', category: 'decoration', name: 'Ladybug Buddy', price: 15, emoji: '🐞' },

  { id: 'flower-daisy', category: 'flower', name: 'Daisy Bloom', price: 35, emoji: '🌼', flowerColor: '#F4D58D' },
  { id: 'flower-rose', category: 'flower', name: 'Rose Bloom', price: 45, emoji: '🌹', flowerColor: '#D9789F' },
];

export const SHOP_CATEGORIES = [
  { id: 'flower', label: 'Flowers' },
  { id: 'pot', label: 'Pots' },
  { id: 'background', label: 'Backgrounds' },
  { id: 'accessory', label: 'Accessories' },
  { id: 'decoration', label: 'Decorations' },
];
