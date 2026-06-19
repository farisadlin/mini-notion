import { CollisionPriority } from "@dnd-kit/abstract";
import { DragDropProvider, useDroppable } from "@dnd-kit/react";
import { useSortable } from "@dnd-kit/react/sortable";
import { useRef } from "react";
import { useTranslation } from "react-i18next";
import { STATUS_OPTIONS, STATUS_LABEL_KEYS } from "../constants";

const findCourse = (courses, courseId) => {
  return courses.find((course) => course.id === courseId);
};

const Column = ({ status, children }) => {
  const { t } = useTranslation();
  const { ref, isDropTarget } = useDroppable({
    id: status,
    accept: "task",
    collisionPriority: CollisionPriority.Low,
  });
  return (
    <section
      ref={ref}
      className={`min-h-80 rounded-lg border p-3 ${isDropTarget ? "border-sky-400 bg-sky-400/10" : "border-slate-800 bg-slate-900/70"}`}
    >
      <h3 className="mb-3 font-semibold text-slate-100">
        {t(STATUS_LABEL_KEYS[status])}
      </h3>
      {children}
    </section>
  );
};

const TaskCard = ({ task, index, course, onEdit }) => {
  const { ref, handleRef, isDragging } = useSortable({
    id: task.id,
    index,
    type: "task",
    accept: "task",
    group: task.status,
  });

  return (
    <article
      ref={ref}
      className={`rounded-md border border-slate-800 bg-slate-950 p-3 shadow-sm ${isDragging ? "opacity-60" : ""}`}
    >
      <div className="flex items-start gap-3">
        <button
          ref={handleRef}
          className="mt-0.5 rounded border border-slate-800 px-1.5 py-1 text-xs text-slate-500 hover:border-slate-600 hover:text-slate-300"
          type="button"
          aria-label={`Drag ${task.title}`}
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
};

export default function KanbanView({
  tasks,
  courses,
  onAdd,
  onEdit,
  onUpdate,
  onReorder,
}) {
  const { t } = useTranslation();
  const draggedTask = useRef(null);

  const findTargetStatus = (targetId) => {
    if (STATUS_OPTIONS.includes(targetId)) return targetId;
    return tasks.find((task) => task.id === targetId)?.status;
  };

  const handleTaskDragStart = (event) => {
    const activeTask = tasks.find(
      (task) => task.id === event.operation.source?.id,
    );
    draggedTask.current = activeTask
      ? { id: activeTask.id, status: activeTask.status }
      : null;
  };

  const handleTaskDragOver = (event) => {
    const { source, target } = event.operation;
    if (!source || !target) return;

    const activeTask = tasks.find((task) => task.id === source.id);
    const targetStatus = findTargetStatus(target.id);

    if (activeTask && targetStatus && activeTask.status !== targetStatus) {
      onUpdate("tasks", activeTask.id, { status: targetStatus });
    }
  };

  const handleTaskDrop = (event) => {
    if (event.canceled) {
      const originalTask = draggedTask.current;
      const currentTask = tasks.find((task) => task.id === originalTask?.id);

      if (originalTask && currentTask?.status !== originalTask.status) {
        onUpdate("tasks", originalTask.id, { status: originalTask.status });
      }

      draggedTask.current = null;
      return;
    }

    const { source, target } = event.operation;
    draggedTask.current = null;
    if (!source || !target) return;

    const activeTask = tasks.find((task) => task.id === source.id);
    if (!activeTask) return;

    const overId = target.id;
    const overTask = tasks.find((task) => task.id === overId);

    // Same column: reorder cards.
    if (overTask && activeTask.status === overTask.status) {
      if (source.id !== target.id) {
        onReorder(source.id, target.id);
      }
      return;
    }

    // Different column: change task status.
    const targetStatus = findTargetStatus(overId);

    if (targetStatus && activeTask.status !== targetStatus) {
      onUpdate("tasks", activeTask.id, { status: targetStatus });
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

      <DragDropProvider
        onDragStart={handleTaskDragStart}
        onDragOver={handleTaskDragOver}
        onDragEnd={handleTaskDrop}
      >
        <div className="grid gap-4 lg:grid-cols-3">
          {STATUS_OPTIONS.map((status) => {
            const columnTasks = tasks.filter((task) => task.status === status);
            return (
              <Column key={status} status={status}>
                <div className="space-y-3">
                  {columnTasks.map((task, index) => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      index={index}
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
              </Column>
            );
          })}
        </div>
      </DragDropProvider>
    </section>
  );
};
