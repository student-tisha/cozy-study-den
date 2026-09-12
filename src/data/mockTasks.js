// Placeholder data — this shape is what we expect Tisha's API to return.
// Components only ever get this data through src/services/taskService.js,
// never by importing this file directly, so swapping to a real API later
// means editing taskService.js only.
export const mockTasks = [
  { id: 't1', title: 'Study DSA', xpValue: 50, done: true },
  { id: 't2', title: 'Exercise', xpValue: 40, done: false },
  { id: 't3', title: 'Read', xpValue: 30, done: true },
  { id: 't4', title: 'Coding', xpValue: 50, done: false },
];

export const initialState = {
  userName: 'Alex',
  xp: 580, // 20 XP under the "Growing Plant" threshold (600) — complete
           // "Exercise" (+40) to see the evolution celebration fire
  coins: 85,
  streak: 5,
  lastActiveDate: new Date().toDateString(),
  tasks: mockTasks,
  // Shop state: which item ids the user has bought, and which one item
  // is currently active per category (one slot each — see shopLogic.js).
  ownedItemIds: [],
  equipped: { pot: null, background: null, accessory: null, decoration: null, flower: null },
};
