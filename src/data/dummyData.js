const today = new Date();
const isoDate = (offsetDays = 0, hours = 9) => {
  const date = new Date(today);
  date.setDate(date.getDate() + offsetDays);
  date.setHours(hours, 0, 0, 0);
  return date.toISOString();
};

export const initialCourses = [
  {
    id: "course-1",
    name: "Product Design",
    credits: 3,
    color: "#38bdf8",
    schedule: "Monday 09:00-10:40",
    location: "Studio A",
  },
  {
    id: "course-2",
    name: "Data Structures",
    credits: 4,
    color: "#a78bfa",
    schedule: "Tuesday 13:00-15:30",
    location: "Lab 204",
  },
  {
    id: "course-3",
    name: "Academic Writing",
    credits: 2,
    color: "#34d399",
    schedule: "Wednesday 08:00-09:40",
    location: "Room 12",
  },
  {
    id: "course-4",
    name: "Business Analytics",
    credits: 3,
    color: "#f59e0b",
    schedule: "Friday 10:00-11:40",
    location: "Hall B",
  },
];

export const initialTasks = [
  {
    id: "task-1",
    title: "Outline usability study",
    status: "In Progress",
    deadline: isoDate(0, 18),
    courseId: "course-1",
    createdAt: isoDate(-7),
  },
  {
    id: "task-2",
    title: "Implement binary tree exercise",
    status: "To Do",
    deadline: isoDate(1, 11),
    courseId: "course-2",
    createdAt: isoDate(-5),
  },
  {
    id: "task-3",
    title: "Submit literature review",
    status: "To Do",
    deadline: isoDate(0, 23),
    courseId: "course-3",
    createdAt: isoDate(-3),
  },
  {
    id: "task-4",
    title: "Clean dashboard dataset",
    status: "Selesai",
    deadline: isoDate(-1),
    courseId: "course-4",
    createdAt: isoDate(-9),
  },
  {
    id: "task-5",
    title: "Prepare sprint retrospective notes",
    status: "In Progress",
    deadline: isoDate(3),
    courseId: null,
    createdAt: isoDate(-2),
  },
];

export const initialNotes = [
  {
    id: "note-1",
    title: "Exam prep checklist",
    content:
      "Prioritize weak chapters, rewrite flashcards, and schedule one focused review block before each quiz.",
    tags: ["study", "exam"],
    createdAt: isoDate(-6),
  },
  {
    id: "note-2",
    title: "Design references",
    content:
      "Collect clean dashboard examples with compact tables, calm charts, and clear empty states for portfolio inspiration.",
    tags: ["design", "portfolio"],
    createdAt: isoDate(-4),
  },
  {
    id: "note-3",
    title: "Meeting recap",
    content:
      "Team agreed to divide research synthesis by topic and review the final slide narrative before Thursday.",
    tags: ["team", "project"],
    createdAt: isoDate(-2),
  },
  {
    id: "note-4",
    title: "Reading notes",
    content:
      "Active recall beats rereading. Convert highlights into questions and revisit them using spaced repetition.",
    tags: ["learning"],
    createdAt: isoDate(-1),
  },
];

export const entityLabels = {
  tasks: "Tugas",
  courses: "Mata Kuliah",
  notes: "Catatan",
};

export const statusOptions = ["To Do", "In Progress", "Selesai"];

export const makeId = (prefix) =>
  `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;

export const createEntity = (entity, values) => {
  const now = new Date().toISOString();
  if (entity === "tasks") {
    return {
      id: makeId("task"),
      title: values.title || "Tugas tanpa judul",
      status: values.status || "To Do",
      deadline: values.deadline || "",
      courseId: values.courseId || null,
      createdAt: now,
    };
  }
  if (entity === "courses") {
    return {
      id: makeId("course"),
      name: values.name || "Mata kuliah tanpa judul",
      credits: Number(values.credits) || 0,
      color: values.color || "#38bdf8",
      schedule: values.schedule || "",
      location: values.location || "",
    };
  }
  return {
    id: makeId("note"),
    title: values.title || "Catatan tanpa judul",
    content: values.content || "",
    tags: Array.isArray(values.tags)
      ? values.tags
      : String(values.tags || "")
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean),
    createdAt: now,
  };
};
