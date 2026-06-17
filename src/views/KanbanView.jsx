import { DndContext, useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useTranslation } from "react-i18next";
import { STATUS_OPTIONS, STATUS_LABEL_KEYS } from "../constants";

function findCourse(courses, courseId) {
  return courses.find((course) => course.id === courseId);
}

function Column({ status, children }) {
  const { t } = useTranslation();
  const { setNodeRef, isOver } = useDroppable({ id: status });
  return (
    <section
      ref={setNodeRef}
      className={`min-h-80 rounded-lg border p-3 ${isOver ? "border-sky-400 bg-sky-400/10" : "border-slate-800 bg-slate-900/70"}`}
    >
      <h3 className="mb-3 font-semibold text-slate-100">
        {t(STATUS_LABEL_KEYS[status])}
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
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  return (
    <article
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={`rounded-md border border-slate-800 bg-slate-950 p-3 shadow-sm ${isDragging ? "opacity-60" : ""}`}
    >
      <div className="flex items-start gap-3">
        <button
          ref={setActivatorNodeRef}
          className="mt-0.5 rounded border border-slate-800 px-1.5 py-1 text-xs text-slate-500 hover:border-slate-600 hover:text-slate-300"
          type="button"
          aria-label={`Drag ${task.title}`}
          {...attributes}
          {...listeners}
        >
          ::
        </button>

        <button
          className="min-w-0 flex-1 text-left"
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
      </div>
    </article>
  );
}

function KanbanView({ tasks, courses, onAdd, onEdit, onUpdate, onReorder }) {
  const { t } = useTranslation();

  function handleTaskDrop({ active, over }) {
    if (!over) return;

    const activeTask = tasks.find((task) => task.id === active.id);
    if (!activeTask) return;

    const overId = over.id;
    const overTask = tasks.find((task) => task.id === overId);

    // Same column: reorder cards.
    if (overTask && activeTask.status === overTask.status) {
      if (active.id !== over.id) {
        onReorder(active.id, over.id);
      }
      return;
    }

    // Different column: change task status.
    const targetStatus = STATUS_OPTIONS.includes(overId)
      ? overId
      : tasks.find((task) => task.id === overId)?.status;

    if (targetStatus && activeTask.status !== targetStatus) {
      onUpdate("tasks", activeTask.id, { status: targetStatus });
    }
  }

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

      <DndContext onDragEnd={handleTaskDrop}>
        <div className="grid gap-4 lg:grid-cols-3">
          {STATUS_OPTIONS.map((status) => {
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
                        course={findCourse(courses, task.courseId)}
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
