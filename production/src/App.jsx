import { useMemo, useState } from "react";
import { arrayMove } from "@dnd-kit/sortable";
import { useTranslation } from "react-i18next";
import Navbar from "./components/Navbar";
import DashboardView from "./views/DashboardView";
import TableView from "./views/TableView";
import KanbanView from "./views/KanbanView";
import CalendarView from "./views/CalendarView";
import GalleryView from "./views/GalleryView";
import FormView from "./views/FormView";
import {
  createCourse,
  createNote,
  createTask,
  initialCourses,
  initialNotes,
  initialTasks,
} from "./data/dummyData";

function App() {
  const { t } = useTranslation();
  const [activeView, setActiveView] = useState("dashboard");
  const [tableEntity, setTableEntity] = useState("tasks");
  const [selectedCourseId, setSelectedCourseId] = useState(null);
  const [tasks, setTasks] = useState(initialTasks);
  const [courses, setCourses] = useState(initialCourses);
  const [notes, setNotes] = useState(initialNotes);
  const [formState, setFormState] = useState({
    entity: null,
    mode: "create",
    item: null,
    previousView: "dashboard",
  });

  const filteredTasks = useMemo(() => {
    if (!selectedCourseId) return tasks;
    return tasks.filter((task) => task.courseId === selectedCourseId);
  }, [selectedCourseId, tasks]);

  const showCourseFilter =
    activeView === "dashboard" ||
    activeView === "kanban" ||
    activeView === "calendar" ||
    (activeView === "table" && tableEntity === "tasks");

  function showCreateForm(entity) {
    setFormState({
      entity,
      mode: "create",
      item: null,
      previousView: activeView,
    });
    setActiveView("form");
  }

  function showEditForm(entity, item) {
    setFormState({
      entity,
      mode: "edit",
      item,
      previousView: activeView,
    });
    setActiveView("form");
  }

  function closeForm() {
    setActiveView(formState.previousView);
    setFormState({
      entity: null,
      mode: "create",
      item: null,
      previousView: "dashboard",
    });
  }

  function addTask(values) {
    setTasks((currentTasks) => [createTask(values), ...currentTasks]);
  }

  function addCourse(values) {
    setCourses((currentCourses) => [createCourse(values), ...currentCourses]);
  }

  function addNote(values) {
    setNotes((currentNotes) => [createNote(values), ...currentNotes]);
  }

  function updateTask(id, values) {
    setTasks((currentTasks) => {
      return currentTasks.map((task) =>
        task.id === id ? { ...task, ...values } : task,
      );
    });
  }

  function updateCourse(id, values) {
    setCourses((currentCourses) => {
      return currentCourses.map((course) =>
        course.id === id ? { ...course, ...values } : course,
      );
    });
  }

  function updateNote(id, values) {
    setNotes((currentNotes) => {
      return currentNotes.map((note) =>
        note.id === id ? { ...note, ...values } : note,
      );
    });
  }

  function deleteTask(id) {
    if (!window.confirm(t("confirm.delete"))) return;
    setTasks((currentTasks) => currentTasks.filter((task) => task.id !== id));
  }

  function deleteCourse(id) {
    if (!window.confirm(t("confirm.delete"))) return;

    setCourses((currentCourses) =>
      currentCourses.filter((course) => course.id !== id),
    );
    setTasks((currentTasks) =>
      currentTasks.map((task) =>
        task.courseId === id ? { ...task, courseId: null } : task,
      ),
    );

    if (selectedCourseId === id) {
      setSelectedCourseId(null);
    }
  }

  function deleteNote(id) {
    if (!window.confirm(t("confirm.delete"))) return;
    setNotes((currentNotes) => currentNotes.filter((note) => note.id !== id));
  }

  function updateItem(entity, id, values) {
    if (entity === "tasks") updateTask(id, values);
    if (entity === "courses") updateCourse(id, values);
    if (entity === "notes") updateNote(id, values);
  }

  function deleteItem(entity, id) {
    if (entity === "tasks") deleteTask(id);
    if (entity === "courses") deleteCourse(id);
    if (entity === "notes") deleteNote(id);
  }

  function saveForm(entity, values) {
    if (formState.mode === "create") {
      if (entity === "tasks") addTask(values);
      if (entity === "courses") addCourse(values);
      if (entity === "notes") addNote(values);
    }

    if (formState.mode === "edit") {
      updateItem(entity, formState.item.id, values);
    }

    closeForm();
  }

  function reorderTask(activeId, overId) {
    setTasks((currentTasks) => {
      const oldIndex = currentTasks.findIndex((task) => task.id === activeId);
      const newIndex = currentTasks.findIndex((task) => task.id === overId);

      if (oldIndex === -1 || newIndex === -1) {
        return currentTasks;
      }

      return arrayMove(currentTasks, oldIndex, newIndex);
    });
  }

  function renderView() {
    if (activeView === "form") {
      return (
        <FormView
          entity={formState.entity}
          mode={formState.mode}
          item={formState.item}
          courses={courses}
          onSave={saveForm}
          onCancel={closeForm}
        />
      );
    }

    if (activeView === "table") {
      return (
        <TableView
          activeEntity={tableEntity}
          tasks={filteredTasks}
          courses={courses}
          notes={notes}
          onEntityChange={setTableEntity}
          onAdd={showCreateForm}
          onEdit={showEditForm}
          onDelete={deleteItem}
        />
      );
    }

    if (activeView === "kanban") {
      return (
        <KanbanView
          tasks={filteredTasks}
          courses={courses}
          onAdd={showCreateForm}
          onEdit={showEditForm}
          onUpdate={updateItem}
          onReorder={reorderTask}
        />
      );
    }

    if (activeView === "calendar") {
      return (
        <CalendarView
          tasks={filteredTasks}
          courses={courses}
          onEdit={showEditForm}
        />
      );
    }

    if (activeView === "gallery") {
      return (
        <GalleryView
          notes={notes}
          onAdd={showCreateForm}
          onEdit={showEditForm}
          onDelete={deleteItem}
        />
      );
    }

    return (
      <DashboardView tasks={filteredTasks} allTasks={tasks} courses={courses} />
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <Navbar
        activeView={activeView}
        onNavigate={setActiveView}
        onQuickAdd={showCreateForm}
      />

      <main>
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-5 sm:px-6 lg:px-8">
          {showCourseFilter && (
            <div className="flex flex-col gap-2 border-b border-slate-800 pb-4 sm:flex-row sm:items-end sm:justify-between">
              <div className="w-full sm:max-w-xs">
                <label
                  className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500"
                  htmlFor="course-filter"
                >
                  {t("filter.label")}
                </label>
                <select
                  className="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20"
                  id="course-filter"
                  value={selectedCourseId || ""}
                  onChange={(event) =>
                    setSelectedCourseId(event.target.value || null)
                  }
                >
                  <option value="">{t("filter.allCourses")}</option>
                  {courses.map((course) => (
                    <option key={course.id} value={course.id}>
                      {course.name}
                    </option>
                  ))}
                </select>
              </div>
              <p
                aria-live="polite"
                className="text-sm text-slate-400 sm:pb-2"
              >
                {t("filter.tasksVisible", { count: filteredTasks.length })}
              </p>
            </div>
          )}

          {renderView()}
        </div>
      </main>
    </div>
  );
}

export default App;
