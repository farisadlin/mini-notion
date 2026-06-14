import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import Sidebar from "./components/Sidebar";
import DashboardView from "./views/DashboardView";
import TableView from "./views/TableView";
import KanbanView from "./views/KanbanView";
import CalendarView from "./views/CalendarView";
import GalleryView from "./views/GalleryView";
import FormView from "./views/FormView";
import {
  createEntity,
  initialCourses,
  initialNotes,
  initialTasks,
} from "./data/dummyData";

const views = {
  dashboard: DashboardView,
  table: TableView,
  kanban: KanbanView,
  calendar: CalendarView,
  gallery: GalleryView,
  form: FormView,
};

function App() {
  const { t } = useTranslation();
  const [activeView, setActiveView] = useState("dashboard");
  const [selectedCourseId, setSelectedCourseId] = useState(null);
  const [tasks, setTasks] = useState(initialTasks);
  const [courses, setCourses] = useState(initialCourses);
  const [notes, setNotes] = useState(initialNotes);
  const [formMeta, setFormMeta] = useState(null);

  function openCreate(entity) {
    setFormMeta({ entity, mode: "create", item: null });
    setActiveView("form");
  }

  function openEdit(entity, item) {
    setFormMeta({ entity, mode: "edit", item });
    setActiveView("form");
  }

  function handleFormSave(entity, values) {
    if (formMeta.mode === "create") {
      const setters = {
        tasks: setTasks,
        courses: setCourses,
        notes: setNotes,
      };
      setters[entity]((items) => [createEntity(entity, values), ...items]);
    } else {
      const setters = {
        tasks: setTasks,
        courses: setCourses,
        notes: setNotes,
      };
      setters[entity]((items) =>
        items.map((item) =>
          item.id === formMeta.item.id ? { ...item, ...values } : item
        )
      );
    }
  }

  function handleFormCancel() {
    setFormMeta(null);
    setActiveView("dashboard");
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

          <ActiveView
            {...(activeView === "form"
              ? {
                  entity: formMeta?.entity,
                  mode: formMeta?.mode,
                  item: formMeta?.item,
                  courses,
                  onSave: handleFormSave,
                  onCancel: handleFormCancel,
                }
              : {
                  tasks: filteredTasks,
                  allTasks: tasks,
                  courses,
                  notes,
                  selectedCourseId,
                  onAdd: openCreate,
                  onEdit: openEdit,
                  onUpdate: (entity, id, patch) => {
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
                  },
                  onDelete: deleteItem,
                })}
          />
        </div>
      </main>
    </div>
  );
}

export default App;
