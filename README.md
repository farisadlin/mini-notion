# Mini Notion

Mini Notion is a small React + Vite lesson project. It teaches how to build a simple productivity workspace with tasks, courses, notes, multiple views, forms, drag-and-drop, and bilingual text.

The code intentionally favors clear beginner logic over clever abstraction. Each entity has its own create, update, and delete path so students can trace what happens from a button click to a state update.

## How To Run

```bash
npm install
npm run dev
```

## Useful Checks

```bash
npm run lint
npm run build
```

## Suggested Reading Order

1. `src/main.jsx` mounts the React app.
2. `src/App.jsx` owns the main state and chooses which view to show.
3. `src/data/dummyData.js` contains starter data and create helpers.
4. `src/components/Navbar.jsx` changes views and opens quick-add forms.
5. `src/views/FormView.jsx` handles create and edit forms.
6. `src/views/TableView.jsx` shows all entities in table form.
7. `src/views/KanbanView.jsx` shows task workflow and drag-and-drop.
8. `src/views/CalendarView.jsx` shows task deadlines by date.
9. `src/views/GalleryView.jsx` shows notes as cards.
10. `src/views/DashboardView.jsx` summarizes schedule, urgency, and progress.
11. `src/i18n/index.js` stores Indonesian and English text.

## Main Ideas To Teach

- State lives in `App.jsx`, then flows down to views as props.
- Views call callback props when users add, edit, delete, or move data.
- Forms use one `formData` object so fields are easy to update.
- Tasks can link to courses through `courseId`.
- Notes store tags as small objects with `name` and `color`.
- The language toggle changes text through `i18next`.
