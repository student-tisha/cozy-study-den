import { useEffect, useRef, useState } from 'react';
import { getGrowthProgress, getStreakStatus } from '../state/gameLogic';
import Card from './ui/Card';
import Badge from './ui/Badge';
import ProgressBar from './ui/ProgressBar';
import './Companion.css';

// A handful of sparkles/stars that fly outward and fade — extra
// variety (not just "✨") makes each event feel a bit more like a
// celebration. Purely decorative — aria-hidden, pointer-events: none —
// so it can never intercept a click/tap meant for something else.
function SparkleBurst() {
  return (
    <div className="sparkle-burst" aria-hidden="true">
      <span className="sparkle sparkle-0">✨</span>
      <span className="sparkle sparkle-1">⭐</span>
      <span className="sparkle sparkle-2">💫</span>
      <span className="sparkle sparkle-3">✨</span>
    </div>
  );
}

// Bold dark outline applied to every filled shape below — that's the
// single biggest ingredient in a "sticker" look (flat/gradient fill +
// a thick dark die-cut edge), versus the old plain flat-color shapes.
const OUTLINE = { stroke: '#2F2418', strokeWidth: 3, strokeLinejoin: 'round', strokeLinecap: 'round' };

// Cute two-dot eyes + blush, layered onto the pot so the companion
// reads as a little character instead of a diagram of a plant.
function PotFace({ cy }) {
  return (
    <g>
      <circle cx="88" cy={cy} r="3.4" fill="#2F2418" />
      <circle cx="112" cy={cy} r="3.4" fill="#2F2418" />
      <ellipse cx="80" cy={cy + 7} rx="6" ry="3.6" fill="#FF8FA3" opacity="0.65" />
      <ellipse cx="120" cy={cy + 7} rx="6" ry="3.6" fill="#FF8FA3" opacity="0.65" />
    </g>
  );
}

// Pot + outline + glossy shine arc + face, shared by every stage so the
// character stays consistent as the plant above it grows.
function PotBase({ potColor, cx, cy, rx, ry }) {
  return (
    <>
      <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill={potColor} {...OUTLINE} strokeWidth="4" />
      <path
        d={`M ${cx - rx * 0.55} ${cy - ry * 0.4} A ${rx * 0.5} ${ry * 0.7} 0 0 1 ${cx - rx * 0.05} ${cy - ry * 0.95}`}
        stroke="rgba(255,255,255,0.55)"
        strokeWidth="6"
        strokeLinecap="round"
        fill="none"
      />
      <PotFace cy={cy - ry * 0.15} />
    </>
  );
}

// One shared two-tone gradient def (light-to-mid green) for leaves —
// gives them depth instead of a single flat fill. Reused per stage
// with a stage-scoped id since only one PlantSVG is ever mounted at a
// time, so ids never actually collide in the DOM.
function LeafGradient({ id }) {
  return (
    <defs>
      <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" style={{ stopColor: 'var(--sage-light)' }} />
        <stop offset="100%" style={{ stopColor: 'var(--sage)' }} />
      </linearGradient>
    </defs>
  );
}

// One inline SVG per growth stage. Still intentionally minimal — a
// few paths each, no external image files needed (nothing to fetch,
// nothing to license) — just outlined + gradient-filled + given a
// face instead of flat solid shapes. `droopy` tilts the whole plant
// slightly via a wrapper class instead of separate SVGs, so streak
// mood and growth stage stay fully independent (per the brief).
function PlantSVG({ stageId, potColor = '#D8C9A3', flowerColor = 'var(--terracotta-pink)' }) {
  switch (stageId) {
    case 'seed':
      return (
        <svg viewBox="0 0 200 200" width="140" height="140">
          <PotBase potColor={potColor} cx={100} cy={160} rx={60} ry={14} />
          <ellipse cx="100" cy="145" rx="18" ry="14" fill="#C9925B" {...OUTLINE} />
        </svg>
      );
    case 'sprout':
      return (
        <svg viewBox="0 0 200 200" width="140" height="140">
          <LeafGradient id="leafGrad-sprout" />
          <PotBase potColor={potColor} cx={100} cy={160} rx={60} ry={14} />
          <path d="M100 150 L100 110" stroke="var(--sage-dark)" strokeWidth="6" strokeLinecap="round" />
          <path d="M100 120 C 80 110, 75 95, 90 90 C 95 105, 100 110, 100 120 Z" fill="url(#leafGrad-sprout)" {...OUTLINE} />
          <path d="M100 120 C 120 110, 125 95, 110 90 C 105 105, 100 110, 100 120 Z" fill="url(#leafGrad-sprout)" {...OUTLINE} />
        </svg>
      );
    case 'young':
      return (
        <svg viewBox="0 0 200 200" width="150" height="150">
          <LeafGradient id="leafGrad-young" />
          <PotBase potColor={potColor} cx={100} cy={165} rx={65} ry={14} />
          <path d="M100 160 L100 80" stroke="var(--sage-dark)" strokeWidth="7" strokeLinecap="round" />
          <path d="M100 130 C 65 120, 55 95, 80 88 C 88 105, 100 115, 100 130 Z" fill="url(#leafGrad-young)" {...OUTLINE} />
          <path d="M100 130 C 135 120, 145 95, 120 88 C 112 105, 100 115, 100 130 Z" fill="url(#leafGrad-young)" {...OUTLINE} />
          <path d="M100 100 C 75 90, 68 70, 90 65 C 96 80, 100 88, 100 100 Z" fill="url(#leafGrad-young)" {...OUTLINE} />
          <path d="M100 100 C 125 90, 132 70, 110 65 C 104 80, 100 88, 100 100 Z" fill="url(#leafGrad-young)" {...OUTLINE} />
        </svg>
      );
    case 'growing':
      return (
        <svg viewBox="0 0 200 200" width="160" height="160">
          <LeafGradient id="leafGrad-growing" />
          <PotBase potColor={potColor} cx={100} cy={170} rx={70} ry={14} />
          <path d="M100 165 L100 60" stroke="var(--sage-dark)" strokeWidth="8" strokeLinecap="round" />
          <path d="M100 140 C 55 130, 45 100, 75 90 C 85 110, 100 120, 100 140 Z" fill="url(#leafGrad-growing)" {...OUTLINE} />
          <path d="M100 140 C 145 130, 155 100, 125 90 C 115 110, 100 120, 100 140 Z" fill="url(#leafGrad-growing)" {...OUTLINE} />
          <path d="M100 105 C 65 95, 58 70, 82 62 C 90 80, 100 90, 100 105 Z" fill="url(#leafGrad-growing)" {...OUTLINE} />
          <path d="M100 105 C 135 95, 142 70, 118 62 C 110 80, 100 90, 100 105 Z" fill="url(#leafGrad-growing)" {...OUTLINE} />
          <path d="M100 75 C 82 65, 78 48, 95 45 C 98 58, 100 65, 100 75 Z" fill="url(#leafGrad-growing)" {...OUTLINE} />
          <path d="M100 75 C 118 65, 122 48, 105 45 C 102 58, 100 65, 100 75 Z" fill="url(#leafGrad-growing)" {...OUTLINE} />
        </svg>
      );
    case 'flowering':
      return (
        <svg viewBox="0 0 200 200" width="170" height="170">
          <LeafGradient id="leafGrad-flowering" />
          <PotBase potColor={potColor} cx={100} cy={175} rx={72} ry={14} />
          <path d="M100 170 L100 60" stroke="var(--sage-dark)" strokeWidth="8" strokeLinecap="round" />
          <path d="M100 140 C 55 130, 45 100, 75 90 C 85 110, 100 120, 100 140 Z" fill="url(#leafGrad-flowering)" {...OUTLINE} />
          <path d="M100 140 C 145 130, 155 100, 125 90 C 115 110, 100 120, 100 140 Z" fill="url(#leafGrad-flowering)" {...OUTLINE} />
          <path d="M100 105 C 65 95, 58 70, 82 62 C 90 80, 100 90, 100 105 Z" fill="url(#leafGrad-flowering)" {...OUTLINE} />
          <path d="M100 105 C 135 95, 142 70, 118 62 C 110 80, 100 90, 100 105 Z" fill="url(#leafGrad-flowering)" {...OUTLINE} />
          {/* flower — mixed colors instead of one flat repeated fill */}
          <circle cx="100" cy="45" r="8" fill="var(--butter)" {...OUTLINE} />
          <circle cx="85" cy="52" r="9" fill={flowerColor} {...OUTLINE} />
          <circle cx="115" cy="52" r="9" fill="var(--violet)" {...OUTLINE} />
          <circle cx="90" cy="35" r="9" fill={flowerColor} {...OUTLINE} />
          <circle cx="110" cy="35" r="9" fill="var(--violet)" {...OUTLINE} />
        </svg>
      );
    case 'final':
    default:
      return (
        <svg viewBox="0 0 200 200" width="180" height="180">
          <LeafGradient id="leafGrad-final" />
          <PotBase potColor={potColor} cx={100} cy={178} rx={75} ry={14} />
          <path d="M100 172 L100 55" stroke="var(--sage-dark)" strokeWidth="9" strokeLinecap="round" />
          <path d="M100 140 C 50 130, 38 98, 72 88 C 84 108, 100 120, 100 140 Z" fill="url(#leafGrad-final)" {...OUTLINE} />
          <path d="M100 140 C 150 130, 162 98, 128 88 C 116 108, 100 120, 100 140 Z" fill="url(#leafGrad-final)" {...OUTLINE} />
          <path d="M100 100 C 62 90, 54 63, 80 55 C 90 75, 100 88, 100 100 Z" fill="url(#leafGrad-final)" {...OUTLINE} />
          <path d="M100 100 C 138 90, 146 63, 120 55 C 110 75, 100 88, 100 100 Z" fill="url(#leafGrad-final)" {...OUTLINE} />
          {/* two flowers, mixed colors for a fuller "max stage" bouquet */}
          <circle cx="80" cy="65" r="7" fill="var(--butter)" {...OUTLINE} />
          <circle cx="68" cy="70" r="7" fill={flowerColor} {...OUTLINE} />
          <circle cx="90" cy="70" r="7" fill="var(--violet)" {...OUTLINE} />
          <circle cx="120" cy="40" r="8" fill="var(--butter)" {...OUTLINE} />
          <circle cx="106" cy="46" r="8" fill={flowerColor} {...OUTLINE} />
          <circle cx="132" cy="46" r="8" fill="var(--violet)" {...OUTLINE} />
          <circle cx="112" cy="28" r="8" fill={flowerColor} {...OUTLINE} />
          <circle cx="128" cy="28" r="8" fill="var(--violet)" {...OUTLINE} />
        </svg>
      );
  }
}

export default function Companion({ xp, streak, compact = false, visuals = {} }) {
  const growth = getGrowthProgress(xp);
  const { stage, nextStage, percent, xpForNextStage } = growth;
  const mood = getStreakStatus(streak);
  const { potColor, flowerColor, backgroundStyle, accessoryEmoji, decorationEmoji } = visuals;

  // ── Four separate visual events, all derived from props or a tap ──
  // 1. "justGrew"      — fires on EVERY xp increase (task completion / XP gain)
  // 2. "justEvolved"   — fires ONLY when the stage id changes (growth milestone)
  // 3. "petted"        — fires when the user taps/clicks the plant directly
  // 4. "justPurchased" — fires when a newly-equipped item changes (shop buy)
  // No global event bus needed: these are all just props/local taps —
  // a change to them IS the event, wherever Companion is rendered.
  const prevXp = useRef(xp);
  const prevStageId = useRef(stage.id);

  // `visuals` is a fresh object literal every render (Dashboard/TasksPage/
  // ShopPage all call getEquippedVisuals(state.equipped) inline), so it
  // never matches by reference. Deriving a primitive string from its
  // actual values means the dependency below is compared by value, not
  // identity, so the effect only re-runs when something really changed.
  const visualsKey = `${potColor}|${flowerColor}|${backgroundStyle}|${accessoryEmoji}|${decorationEmoji}`;
  const prevVisualsKey = useRef(visualsKey);
  const [justGrew, setJustGrew] = useState(false);
  const [justEvolved, setJustEvolved] = useState(false);
  const [petted, setPetted] = useState(false);
  const [justPurchased, setJustPurchased] = useState(false);

  useEffect(() => {
    if (xp > prevXp.current) {
      setJustGrew(true);
      const timer = setTimeout(() => setJustGrew(false), 700);
      prevXp.current = xp;
      return () => clearTimeout(timer);
    }
    prevXp.current = xp;
  }, [xp]);

  useEffect(() => {
    if (stage.id !== prevStageId.current) {
      setJustEvolved(true);
      const timer = setTimeout(() => setJustEvolved(false), 1200);
      prevStageId.current = stage.id;
      return () => clearTimeout(timer);
    }
    prevStageId.current = stage.id;
  }, [stage.id]);

  useEffect(() => {
    if (visualsKey !== prevVisualsKey.current) {
      setJustPurchased(true);
      const timer = setTimeout(() => setJustPurchased(false), 900);
      prevVisualsKey.current = visualsKey;
      return () => clearTimeout(timer);
    }
    prevVisualsKey.current = visualsKey;
  }, [visualsKey]);

  function handlePet() {
    setPetted(true);
    setTimeout(() => setPetted(false), 500);
  }

  function handlePetKeyDown(e) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handlePet();
    }
  }

  const showSparkles = justGrew || justEvolved || petted || justPurchased;

  return (
    <Card
      className={`companion-card slide-up ${justGrew ? 'companion-pulse' : ''} ${justEvolved ? 'companion-evolve' : ''} ${justPurchased ? 'companion-pulse' : ''}`}
      style={backgroundStyle ? { background: backgroundStyle } : undefined}
    >
      <div className="companion-card-header">
        <h2>Your Companion</h2>
        <Badge tone="sage">🔥 {streak} day streak</Badge>
      </div>

      {/* Outer layer: mood (streak) — rotate/sway only, set by class.
          Also the tap/click target for the "pet" interaction, on both
          mouse and touch (onClick fires for both). */}
      <div
        className={`companion-stage-wrap mood-${mood.id}`}
        onClick={handlePet}
        onKeyDown={handlePetKeyDown}
        role="button"
        tabIndex={0}
        aria-label="Pet your companion"
      >
        {/* Middle layer: hover response (desktop only) + tap press
            feedback (mobile) — isolated so it never fights the mood
            transform above or the breathing animation below. */}
        <div className={`companion-plant-hover ${petted ? 'companion-petted' : ''}`}>
          {/* Inner layer: continuous idle breathing — always running,
              independent of mood/hover/pet, so the plant never looks
              frozen even when nothing else is happening. */}
          <div className="companion-plant-idle">
            <PlantSVG stageId={stage.id} potColor={potColor} flowerColor={flowerColor} />
          </div>
        </div>

        {/* Cosmetic overlays from the shop — purely additive, never
            block the pet-tap target since they don't capture clicks
            (positioned via CSS, no pointer-events needed to change). */}
        {accessoryEmoji && <span className="companion-accessory">{accessoryEmoji}</span>}
        {decorationEmoji && <span className="companion-decoration">{decorationEmoji}</span>}

        {showSparkles && <SparkleBurst />}
        {justGrew && <span className="companion-xp-pop">+XP</span>}
      </div>

      <p className="companion-stage-label">{stage.label}</p>
      <p className="companion-mood-label">Feeling: {mood.label}</p>

      {!compact && (
        <>
          <ProgressBar value={percent} color="butter" label={`${xp} XP total`} />
          <p className="companion-next-stage">
            {nextStage
              ? `${xpForNextStage} XP to evolve into ${nextStage.label}`
              : 'Fully grown — max stage reached! 🎉'}
          </p>
        </>
      )}
    </Card>
  );
}
