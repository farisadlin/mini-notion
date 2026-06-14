import { useState } from "react";
import { useTranslation } from "react-i18next";

function CalendarView({ tasks, courses, onEdit }) {
  const { t, i18n } = useTranslation();
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().slice(0, 10),
  );

  const dateTasks = tasks.filter((task) => {
    if (!task.deadline) return false;
    const taskDate = new Date(task.deadline).toISOString().slice(0, 10);
    return taskDate === selectedDate;
  });

  const formattedDate = new Date(`${selectedDate}T12:00:00`).toLocaleDateString(
    i18n.language === "id" ? "id-ID" : "en-US",
    { weekday: "long", year: "numeric", month: "long", day: "numeric" },
  );

  return (
    <section className="space-y-5">
      <div>
        <h2 className="text-2xl font-semibold text-slate-50">
          {t("calendar.title")}
        </h2>
        <p className="text-sm text-slate-400">{t("calendar.subtitle")}</p>
      </div>

      <div className="flex items-center gap-4">
        <input
          className="rounded-md border border-slate-700 bg-slate-900 px-4 py-2.5 text-slate-100 outline-none focus:border-sky-400"
          type="date"
          value={selectedDate}
          onChange={(event) => setSelectedDate(event.target.value)}
        />
        <span className="text-sm text-slate-400">{formattedDate}</span>
      </div>

      <div className="space-y-3">
        {dateTasks.length > 0 ? (
          dateTasks.map((task) => {
            const course = courses.find((item) => item.id === task.courseId);
            return (
              <button
                className="w-full rounded-lg border border-slate-800 bg-slate-900/70 p-4 text-left hover:border-slate-600"
                key={task.id}
                type="button"
                onClick={() => onEdit("tasks", task)}
              >
                <div className="flex items-center gap-2">
                  {course && (
                    <span
                      className="h-2.5 w-2.5 rounded-full"
                      style={{ backgroundColor: course.color }}
                    />
                  )}
                  <p className="font-medium text-slate-100">{task.title}</p>
                </div>
                <p className="mt-1 text-sm text-slate-500">
                  {t(
                    task.status === "To Do"
                      ? "status.todo"
                      : task.status === "In Progress"
                        ? "status.inProgress"
                        : "status.done",
                  )}
                </p>
              </button>
            );
          })
        ) : (
          <p className="text-sm text-slate-400">{t("calendar.noTasks")}</p>
        )}
      </div>
    </section>
  );
}

export default CalendarView;
