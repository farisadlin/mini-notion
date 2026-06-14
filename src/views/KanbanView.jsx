import { DndContext, useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useTranslation } from "react-i18next";
import { statusOptions } from "../data/dummyData";

const statusLabelKeys = {
  "To Do": "kanban.todo",
  "In Progress": "kanban.inProgress",
  Selesai: "kanban.done",
};

function Column({ status, children }) {
  const { t } = useTranslation();
  const { setNodeRef, isOver } = useDroppable({ id: status });
  return (
    <section
      ref={setNodeRef}
      className={`min-h-80 rounded-lg border p-3 ${isOver ? "border-sky-400 bg-sky-400/10" : "border-slate-800 bg-slate-900/70"}`}
    >
      <h3 className="mb-3 font-semibold text-slate-100">
        {t(statusLabelKeys[status])}
      </h3>
      {children}
    </section>
  );
}

function TaskCard({ task, course, onEdit }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });
  return (
    <article
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={`rounded-md border border-slate-800 bg-slate-950 p-3 shadow-sm ${isDragging ? "opacity-60" : ""}`}
      {...attributes}
      {...listeners}
    >
      <button
        className="w-full text-left"
        type="button"
        onClick={() => onEdit("tasks", task)}
      >
        <div className="flex items-start justify-between gap-3">
          <p className="font-medium text-slate-100">{task.title}</p>
          {course && (
            <span
              className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full"
              style={{ backgroundColor: course.color }}
            />
          )}
        </div>
        {task.deadline && (
          <p className="mt-2 text-xs text-slate-400">
            {new Date(task.deadline).toLocaleString([], {
              dateStyle: "medium",
              timeStyle: "short",
            })}
          </p>
        )}
      </button>
    </article>
  );
}

function KanbanView({ tasks, courses, onAdd, onEdit, onUpdate }) {
  const { t } = useTranslation();

  const handleDragEnd = ({ active, over }) => {
    if (!over) return;
    const targetStatus = statusOptions.includes(over.id)
      ? over.id
      : tasks.find((task) => task.id === over.id)?.status;
    const task = tasks.find((item) => item.id === active.id);
    if (task && targetStatus && task.status !== targetStatus) {
      onUpdate("tasks", task.id, { status: targetStatus });
    }
  };

  return (
    <section className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-semibold text-slate-50">
            {t("kanban.title")}
          </h2>
          <p className="text-sm text-slate-400">{t("kanban.subtitle")}</p>
        </div>
        <button
          className="rounded-md bg-sky-500 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-sky-400"
          type="button"
          onClick={() => onAdd("tasks")}
        >
          {t("kanban.addTask")}
        </button>
      </div>

      <DndContext onDragEnd={handleDragEnd}>
        <div className="grid gap-4 lg:grid-cols-3">
          {statusOptions.map((status) => {
            const columnTasks = tasks.filter((task) => task.status === status);
            return (
              <Column key={status} status={status}>
                <SortableContext
                  items={columnTasks.map((task) => task.id)}
                  strategy={verticalListSortingStrategy}
                >
                  <div className="space-y-3">
                    {columnTasks.map((task) => (
                      <TaskCard
                        key={task.id}
                        task={task}
                        course={courses.find(
                          (course) => course.id === task.courseId,
                        )}
                        onEdit={onEdit}
                      />
                    ))}
                    {!columnTasks.length && (
                      <p className="rounded-md border border-dashed border-slate-700 p-3 text-sm text-slate-500">
                        {t("kanban.noTasks")}
                      </p>
                    )}
                  </div>
                </SortableContext>
              </Column>
            );
          })}
        </div>
      </DndContext>
    </section>
  );
}

export default KanbanView;
