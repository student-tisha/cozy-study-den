import { mockShopItems } from '../data/mockShop';

// ── Purchasing ──────────────────────────────────────────────────────
// Deliberately simple: no quantities, no "inventory list" UI, no
// stacking. Owning an item is just "its id is in ownedItemIds". One
// item per category can be equipped at a time (state.equipped.<cat>).
// If the API later supports something richer (multiple equip slots,
// consumables, etc.) this file is the only place that needs to grow —
// components just call purchaseItem()/toggleEquip() and re-render.
export function purchaseItem(state, item) {
  const alreadyOwned = state.ownedItemIds.includes(item.id);
  if (alreadyOwned || state.coins < item.price) return state; // no-op guard

  return {
    ...state,
    coins: state.coins - item.price,
    ownedItemIds: [...state.ownedItemIds, item.id],
    // Newly bought items auto-equip into their category's single slot.
    equipped: { ...state.equipped, [item.category]: item.id },
  };
}

// Lets the user switch between two items they already own in the same
// category (e.g. owns both pots, wants to switch which is active).
export function toggleEquip(state, item) {
  const isEquipped = state.equipped[item.category] === item.id;
  return {
    ...state,
    equipped: { ...state.equipped, [item.category]: isEquipped ? null : item.id },
  };
}

// ── Resolving equipped ids into actual visual values ────────────────
// Companion.jsx shouldn't know about shop items or ids at all — it
// just receives a "visuals" object with plain CSS-ready values. This
// function is the only place that translates "equipped.pot = 'pot-
// terracotta'" into an actual color.
export function getEquippedVisuals(equipped) {
  const find = (id) => mockShopItems.find((i) => i.id === id);

  const pot = find(equipped.pot);
  const background = find(equipped.background);
  const accessory = find(equipped.accessory);
  const decoration = find(equipped.decoration);
  const flower = find(equipped.flower);

  return {
    potColor: pot?.potColor ?? null,
    backgroundStyle: background?.bg ?? null,
    accessoryEmoji: accessory?.emoji ?? null,
    decorationEmoji: decoration?.emoji ?? null,
    flowerColor: flower?.flowerColor ?? null,
  };
}
