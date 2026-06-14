// ─── Navigation ────────────────────────────
export const NAV_ITEMS = [
  ["dashboard", "nav.dashboard"],
  ["table", "nav.table"],
  ["kanban", "nav.kanban"],
  ["calendar", "nav.calendar"],
  ["gallery", "nav.gallery"],
];

// ─── Entity ──────────────────────────────────
export const ENTITY_LABELS = {
  tasks: "Tugas",
  courses: "Mata Kuliah",
  notes: "Catatan",
};

export const ENTITY_KEYS = ["tasks", "courses", "notes"];

// ─── Status ──────────────────────────────────
export const STATUS_OPTIONS = ["To Do", "In Progress", "Selesai"];

export const STATUS_LABEL_KEYS = {
  "To Do": "kanban.todo",
  "In Progress": "kanban.inProgress",
  Selesai: "kanban.done",
};

export const STATUS_LABELS = {
  "To Do": "status.todo",
  "In Progress": "status.inProgress",
  Selesai: "status.done",
};

// ─── Tags ────────────────────────────────────
export const TAG_PALETTE = [
  "#38bdf8",
  "#f43f5e",
  "#10b981",
  "#f59e0b",
  "#8b5cf6",
  "#06b6d4",
  "#ec4899",
  "#84cc16",
  "#a855f7",
  "#14b8a6",
];
