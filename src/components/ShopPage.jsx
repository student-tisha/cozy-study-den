import { useState } from 'react';
import Companion from './Companion';
import Card from './ui/Card';
import Badge from './ui/Badge';
import Button from './ui/Button';
import ShopSkeleton from './skeletons/ShopSkeleton';
import EmptyState from './EmptyState';
import ErrorState from './ErrorState';
import { SHOP_CATEGORIES } from '../data/mockShop';
import { getEquippedVisuals } from '../state/shopLogic';
import './ShopPage.css';

function ShopItemCard({ item, owned, equipped, canAfford, justBoughtId, onBuy, onToggleEquip }) {
  const justBought = justBoughtId === item.id;

  return (
    <Card className={`shop-item-card ${justBought ? 'shop-item-bought' : ''}`}>
      {equipped && <Badge tone="sage" className="shop-item-equipped-badge">Equipped</Badge>}
      <div className="shop-item-icon">{item.emoji}</div>
      <p className="shop-item-name">{item.name}</p>
      <p className="shop-item-price">🪙 {item.price}</p>

      {owned ? (
        <Button
          variant={equipped ? 'ghost' : 'secondary'}
          onClick={() => onToggleEquip(item)}
          style={{ width: '100%' }}
        >
          {equipped ? 'Unequip' : 'Equip'}
        </Button>
      ) : (
        <Button
          variant="primary"
          disabled={!canAfford}
          onClick={() => onBuy(item)}
          style={{ width: '100%' }}
        >
          {canAfford ? 'Buy' : 'Not enough coins'}
        </Button>
      )}
    </Card>
  );
}

export default function ShopPage({
  state,
  shopStatus,
  shopItems,
  onRetryShop,
  onPurchase,
  onToggleEquip,
}) {
  // Brief highlight on the item card that was just bought — the
  // "satisfying but subtle" purchase animation, separate from the
  // companion's own reaction (which fires from the visuals change).
  const [justBoughtId, setJustBoughtId] = useState(null);

  function handleBuy(item) {
    onPurchase(item);
    setJustBoughtId(item.id);
    setTimeout(() => setJustBoughtId(null), 700);
  }

  if (shopStatus === 'loading') return <ShopSkeleton />;
  if (shopStatus === 'error') {
    return <ErrorState title="Couldn't load the shop" onRetry={onRetryShop} />;
  }
  if (shopItems.length === 0) {
    return (
      <EmptyState
        emoji="🛍️"
        title="Shop's empty right now"
        message="Check back soon — new cozy items are on the way."
      />
    );
  }

  const visuals = getEquippedVisuals(state.equipped);

  return (
    <div className="shop-page">
      <div className="shop-page-header">
        <h1>Shop</h1>
        <Badge tone="butter">🪙 {state.coins} coins</Badge>
      </div>

      {/* Live preview — buying/equipping something changes this
          companion instantly, so the shop never feels disconnected
          from the thing you're actually decorating. */}
      <Companion xp={state.xp} streak={state.streak} compact visuals={visuals} />

      {SHOP_CATEGORIES.map((cat) => {
        const itemsInCategory = shopItems.filter((i) => i.category === cat.id);
        if (itemsInCategory.length === 0) return null;

        return (
          <section key={cat.id} className="shop-category">
            <h2 className="shop-category-title">{cat.label}</h2>
            <div className="shop-item-grid">
              {itemsInCategory.map((item) => (
                <ShopItemCard
                  key={item.id}
                  item={item}
                  owned={state.ownedItemIds.includes(item.id)}
                  equipped={state.equipped[item.category] === item.id}
                  canAfford={state.coins >= item.price}
                  justBoughtId={justBoughtId}
                  onBuy={handleBuy}
                  onToggleEquip={onToggleEquip}
                />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
