import { useEffect, useState } from 'react';
import NavBar from './components/ui/NavBar';
import Dashboard from './components/Dashboard';
import TasksPage from './components/TasksPage';
import ShopPage from './components/ShopPage';
import ComingSoon from './components/ComingSoon';
import EvolutionBanner from './components/EvolutionBanner';
import DevNetworkToggle from './components/DevNetworkToggle';
import { initialState } from './data/mockTasks';
import { completeTask, getGrowthStage } from './state/gameLogic';
import { purchaseItem, toggleEquip } from './state/shopLogic';
import { fetchTasks, submitTaskCompletion } from './services/taskService';
import { fetchShopItems } from './services/shopService';
import './styles/theme.css';
import './styles/animations.css';

const NAV_ITEMS = ['Dashboard', 'Tasks', 'Garden', 'Shop'];

export default function App() {
  // App owns the single source of truth for both game state AND which
  // nav tab is active. Everything below just receives props/callbacks —
  // no router library needed for 4 tabs on a hackathon timeline.
  const [state, setState] = useState(initialState);
  const [page, setPage] = useState('Dashboard');
  const [evolvedStage, setEvolvedStage] = useState(null);

  // ── Async task loading ── (unchanged from the loading-states milestone)
  const [tasksStatus, setTasksStatus] = useState('loading');

  // ── Async shop loading ── same pattern as tasks, its own status so
  // visiting the Shop tab doesn't affect the Dashboard/Tasks loading state.
  const [shopStatus, setShopStatus] = useState('loading');
  const [shopItems, setShopItems] = useState([]);

  // Dev-only: which mock network condition to simulate. See
  // DevNetworkToggle.jsx — delete both once a real API exists.
  const [simulate, setSimulate] = useState('normal');

  function loadTasks() {
    setTasksStatus('loading');
    fetchTasks({ simulate })
      .then((tasks) => {
        setState((prev) => ({ ...prev, tasks }));
        setTasksStatus('success');
      })
      .catch(() => setTasksStatus('error'));
  }

  function loadShop() {
    setShopStatus('loading');
    fetchShopItems({ simulate })
      .then((items) => {
        setShopItems(items);
        setShopStatus('success');
      })
      .catch(() => setShopStatus('error'));
  }

  // Re-fetch whenever the simulated network condition changes, so
  // switching the dev toggle actually demonstrates each state live.
  useEffect(loadTasks, [simulate]);
  useEffect(loadShop, [simulate]);

  function handleCompleteTask(taskId) {
    const nextState = completeTask(state, taskId);

    // Detect a threshold crossing by comparing growth stage BEFORE and
    // AFTER this task's XP is applied. This is the one place in the
    // app that decides "did an evolution just happen?" — everywhere
    // else (Companion.jsx) only reacts to the xp/stage it's given.
    const prevStage = getGrowthStage(state.xp);
    const newStage = getGrowthStage(nextState.xp);

    // 1. Update local state immediately (optimistic) — this is what makes
    //    the UI feel instant regardless of network speed later.
    setState(nextState);

    // 2. Tell the "server" (mock for now). When the real API is ready,
    //    this is where we'd check the response and roll back local state
    //    on failure — the call site doesn't change, only taskService.js does.
    // The .catch() is required even though the mock always resolves:
    // without it, swapping in a real (sometimes-failing) fetch() later
    // throws an unhandled promise rejection the moment it fails.
    submitTaskCompletion(taskId).catch((err) => {
      console.error('Failed to submit task completion:', err);
    });

    // 3. If the stage id actually changed, show the celebration banner
    //    for a few seconds, then clear it.
    if (newStage.id !== prevStage.id) {
      setEvolvedStage(newStage);
      setTimeout(() => setEvolvedStage(null), 2600);
    }
  }

  // Shop purchases/equips are synchronous local-state updates for now
  // (see shopLogic.js) — same "optimistic first" shape as tasks, ready
  // to add a submitPurchase()-style API call later without changing
  // ShopPage.jsx.
  function handlePurchase(item) {
    setState((prev) => purchaseItem(prev, item));
  }

  function handleToggleEquip(item) {
    setState((prev) => toggleEquip(prev, item));
  }

  return (
    <>
      <EvolutionBanner stage={evolvedStage} />
      <NavBar
        items={NAV_ITEMS.map((label) => ({
          label,
          active: page === label,
          onClick: () => setPage(label),
        }))}
      />
      <div className="container">
        {page === 'Dashboard' && (
          <Dashboard
            state={state}
            tasksStatus={tasksStatus}
            onCompleteTask={handleCompleteTask}
            onRetryTasks={loadTasks}
          />
        )}
        {page === 'Tasks' && (
          <TasksPage
            state={state}
            tasksStatus={tasksStatus}
            onCompleteTask={handleCompleteTask}
            onRetryTasks={loadTasks}
          />
        )}
        {page === 'Garden' && <ComingSoon label="Companion / Garden" />}
        {page === 'Shop' && (
          <ShopPage
            state={state}
            shopStatus={shopStatus}
            shopItems={shopItems}
            onRetryShop={loadShop}
            onPurchase={handlePurchase}
            onToggleEquip={handleToggleEquip}
          />
        )}
      </div>
      <DevNetworkToggle value={simulate} onChange={setSimulate} />
    </>
  );
}
