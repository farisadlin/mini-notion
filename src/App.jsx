import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import Sidebar from "./components/Sidebar";
import DashboardView from "./views/DashboardView";
import TableView from "./views/TableView";
import KanbanView from "./views/KanbanView";
import CalendarView from "./views/CalendarView";
import GalleryView from "./views/GalleryView";
import {
  createEntity,
  initialCourses,
  initialNotes,
  initialTasks,
  statusOptions,
} from "./data/dummyData";

const views = {
  dashboard: DashboardView,
  table: TableView,
  kanban: KanbanView,
  calendar: CalendarView,
  gallery: GalleryView,
};

const statusLabelKeys = {
  "To Do": "status.todo",
  "In Progress": "status.inProgress",
  Selesai: "status.done",
};

function App() {
  const { t } = useTranslation();
  const [activeView, setActiveView] = useState("dashboard");
  const [selectedCourseId, setSelectedCourseId] = useState(null);
  const [tasks, setTasks] = useState(initialTasks);
  const [courses, setCourses] = useState(initialCourses);
  const [notes, setNotes] = useState(initialNotes);
  const [form, setForm] = useState(null); // { entity, mode, item }

  // ── Form state ──
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [status, setStatus] = useState("To Do");
  const [deadline, setDeadline] = useState("");
  const [courseId_local, setCourseId] = useState("");
  const [name, setName] = useState("");
  const [credits, setCredits] = useState("");
  const [color, setColor] = useState("#38bdf8");
  const [schedule, setSchedule] = useState("");
  const [location, setLocation] = useState("");
  const [tags, setTags] = useState("");

  function resetForm() {
    setTitle("");
    setContent("");
    setStatus("To Do");
    setDeadline("");
    setCourseId("");
    setName("");
    setCredits("");
    setColor("#38bdf8");
    setSchedule("");
    setLocation("");
    setTags("");
    setForm(null);
  }

  function openCreate(entity) {
    resetForm();
    setForm({ entity, mode: "create", item: null });
  }

  function openEdit(entity, item) {
    setTitle(item.title || "");
    setContent(item.content || "");
    setStatus(item.status || "To Do");
    setDeadline(item.deadline ? item.deadline.slice(0, 16) : "");
    setCourseId(item.courseId || "");
    setName(item.name || "");
    setCredits(item.credits || "");
    setColor(item.color || "#38bdf8");
    setSchedule(item.schedule || "");
    setLocation(item.location || "");
    setTags(Array.isArray(item.tags) ? item.tags.join(", ") : item.tags || "");
    setForm({ entity, mode: "edit", item });
  }

  function handleSubmit(e) {
    e.preventDefault();
    const values = {};
    const ent = form.entity;

    if (ent === "tasks") {
      values.title = title;
      values.status = status;
      values.deadline = deadline ? new Date(deadline).toISOString() : "";
      values.courseId = courseId_local || null;
    } else if (ent === "courses") {
      values.name = name;
      values.credits = Number(credits);
      values.color = color;
      values.schedule = schedule;
      values.location = location;
    } else if (ent === "notes") {
      values.title = title;
      values.content = content;
      values.tags = tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);
    }

    if (form.mode === "create") {
      const setters = {
        tasks: setTasks,
        courses: setCourses,
        notes: setNotes,
      };
      setters[ent]((items) => [createEntity(ent, values), ...items]);
    } else {
      const setters = {
        tasks: setTasks,
        courses: setCourses,
        notes: setNotes,
      };
      setters[ent]((items) =>
        items.map((item) =>
          item.id === form.item.id ? { ...item, ...values } : item
        )
      );
    }

    resetForm();
  }

  function deleteItem(entity, id) {
    if (!window.confirm(t("confirm.delete"))) return;
    const setters = { tasks: setTasks, courses: setCourses, notes: setNotes };
    if (entity === "courses") {
      setTasks((items) =>
        items.map((task) =>
          task.courseId === id ? { ...task, courseId: null } : task
        )
      );
      if (selectedCourseId === id) setSelectedCourseId(null);
    }
    setters[entity]((items) => items.filter((item) => item.id !== id));
  }

  const filteredTasks = useMemo(() => {
    if (!selectedCourseId) return tasks;
    return tasks.filter((task) => task.courseId === selectedCourseId);
  }, [selectedCourseId, tasks]);

  const selectedCourse = courses.find((c) => c.id === selectedCourseId);
  const ActiveView = views[activeView] || DashboardView;

  // ── Render form inputs ──
  function renderForm() {
    const ent = form.entity;
    const entityName =
      ent === "tasks"
        ? t("entity.tasks")
        : ent === "courses"
          ? t("entity.courses")
          : t("entity.notes");
    const btnLabel =
      form.mode === "create" ? t("modal.add") : t("modal.edit");

    return (
      <div className="rounded-lg border border-slate-700 bg-slate-900/80 p-4">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-semibold text-slate-50">
            {btnLabel} {entityName}
          </h3>
          <button
            className="text-sm text-slate-400 hover:text-slate-100"
            type="button"
            onClick={resetForm}
          >
            {t("modal.close")}
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          {/* Tasks */}
          {ent === "tasks" && (
            <>
              <input
                className="w-full rounded border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none focus:border-sky-400"
                placeholder={t("column.title")}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              <select
                className="w-full rounded border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none focus:border-sky-400"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                {statusOptions.map((s) => (
                  <option key={s} value={s}>
                    {t(statusLabelKeys[s])}
                  </option>
                ))}
              </select>
              <input
                className="w-full rounded border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none focus:border-sky-400"
                type="datetime-local"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
              />
              <select
                className="w-full rounded border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none focus:border-sky-400"
                value={courseId_local}
                onChange={(e) => setCourseId(e.target.value)}
              >
                <option value="">{t("modal.noCourse")}</option>
                {courses.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </>
          )}

          {/* Courses */}
          {ent === "courses" && (
            <>
              <input
                className="w-full rounded border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none focus:border-sky-400"
                placeholder={t("column.name")}
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <input
                className="w-full rounded border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none focus:border-sky-400"
                type="number"
                placeholder={t("column.credits")}
                value={credits}
                onChange={(e) => setCredits(e.target.value)}
              />
              <input
                className="h-10 w-full rounded border border-slate-700 bg-slate-950 px-2"
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
              />
              <input
                className="w-full rounded border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none focus:border-sky-400"
                placeholder={t("column.schedule")}
                value={schedule}
                onChange={(e) => setSchedule(e.target.value)}
              />
              <input
                className="w-full rounded border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none focus:border-sky-400"
                placeholder={t("column.location")}
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </>
          )}

          {/* Notes */}
          {ent === "notes" && (
            <>
              <input
                className="w-full rounded border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none focus:border-sky-400"
                placeholder={t("column.title")}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              <textarea
                className="min-h-24 w-full rounded border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none focus:border-sky-400"
                placeholder={t("column.content")}
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
              <input
                className="w-full rounded border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none focus:border-sky-400"
                placeholder="tag1, tag2, tag3"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
              />
            </>
          )}

          <div className="flex gap-2 pt-1">
            <button
              className="rounded bg-sky-500 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-sky-400"
              type="submit"
            >
              {t("modal.save")}
            </button>
            <button
              className="rounded border border-slate-700 px-4 py-2 text-sm text-slate-200 hover:bg-slate-800"
              type="button"
              onClick={resetForm}
            >
              {t("modal.cancel")}
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <Sidebar
        activeView={activeView}
        courses={courses}
        selectedCourseId={selectedCourseId}
        onNavigate={setActiveView}
        onQuickAdd={openCreate}
        onSelectCourse={(courseId) => {
          setSelectedCourseId(courseId);
          setActiveView("table");
        }}
        onClearCourse={() => setSelectedCourseId(null)}
      />

      <main className="min-h-screen pl-0 lg:pl-72">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-5 sm:px-6 lg:px-8">
          {selectedCourse && (
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-slate-800 bg-slate-900/80 px-4 py-3">
              <div className="flex items-center gap-3">
                <span
                  className="h-3 w-3 rounded-full"
                  style={{ backgroundColor: selectedCourse.color }}
                />
                <div>
                  <p className="text-sm font-semibold text-slate-100">
                    {t("filter.filteredBy", { name: selectedCourse.name })}
                  </p>
                  <p className="text-xs text-slate-400">
                    {t("filter.tasksVisible", { count: filteredTasks.length })}
                  </p>
                </div>
              </div>
              <button
                className="rounded-md border border-slate-700 px-3 py-2 text-sm text-slate-200 hover:border-slate-500 hover:bg-slate-800"
                type="button"
                onClick={() => setSelectedCourseId(null)}
              >
                {t("button.clearFilter")}
              </button>
            </div>
          )}

          {/* ── Inline form (instead of modal) ── */}
          {form && renderForm()}

          <ActiveView
            tasks={filteredTasks}
            allTasks={tasks}
            courses={courses}
            notes={notes}
            selectedCourseId={selectedCourseId}
            onAdd={openCreate}
            onEdit={openEdit}
            onUpdate={(entity, id, patch) => {
              const setters = {
                tasks: setTasks,
                courses: setCourses,
                notes: setNotes,
              };
              setters[entity]((items) =>
                items.map((item) =>
                  item.id === id ? { ...item, ...patch } : item
                )
              );
            }}
            onDelete={deleteItem}
          />
        </div>
      </main>
    </div>
  );
}

export default App;
