import { useState } from "react";
import { useTranslation } from "react-i18next";

const findCourse = (courses, courseId) => {
  return courses.find((course) => course.id === courseId);
}

const getStatusLabelKey = (status) => {
  if (status === "To Do") return "status.todo";
  if (status === "In Progress") return "status.inProgress";
  return "status.done";
}

export default function CalendarView({ tasks, courses, onEdit }) {
  const { t, i18n } = useTranslation();
  const locale = i18n.language === "id" ? "id-ID" : "en-US";
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());

  const goPrevMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1),
    );
  };

  const goNextMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1),
    );
  };

  const monthLabel = currentMonth.toLocaleDateString(locale, {
    month: "long",
    year: "numeric",
  });

  const dayHeaders = Array.from({ length: 7 }, (_, index) => {
    const day = new Date(2026, 0, 4 + index);
    return day.toLocaleDateString(locale, { weekday: "short" });
  });

  const isSameDay = (firstDate, secondDate) =>
    firstDate.getFullYear() === secondDate.getFullYear() &&
    firstDate.getMonth() === secondDate.getMonth() &&
    firstDate.getDate() === secondDate.getDate();

  const isToday = (date) => isSameDay(date, new Date());

  const getTasksForDay = (day) =>
    tasks.filter((task) => {
      if (!task.deadline) return false;
      const taskDate = new Date(task.deadline);
      return isSameDay(taskDate, day);
    });

  const buildCalendarDays = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startPad = firstDay.getDay();
    const totalDays = lastDay.getDate();
    const days = [];
    const prevMonthLastDay = new Date(year, month, 0).getDate();

    for (let index = startPad - 1; index >= 0; index -= 1) {
      days.push({
        date: new Date(year, month - 1, prevMonthLastDay - index),
        isCurrentMonth: false,
      });
    }

    for (let day = 1; day <= totalDays; day += 1) {
      days.push({
        date: new Date(year, month, day),
        isCurrentMonth: true,
      });
    }

    while (days.length % 7 !== 0) {
      const nextDay = days.length - startPad - totalDays + 1;
      days.push({
        date: new Date(year, month + 1, nextDay),
        isCurrentMonth: false,
      });
    }

    return days;
  };

  const calendarDays = buildCalendarDays();
  const selectedTasks = getTasksForDay(selectedDate);
  const selectedLabel = selectedDate.toLocaleDateString(locale, {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <section className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-semibold text-slate-50">
            {t("calendar.title")}
          </h2>
          <p className="text-sm text-slate-400">{t("calendar.subtitle")}</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            className="rounded-md border border-slate-700 px-3 py-2 text-sm hover:bg-slate-800"
            type="button"
            onClick={goPrevMonth}
          >
            {t("calendar.prev")}
          </button>
          <span className="min-w-36 text-center font-semibold text-slate-100">
            {monthLabel}
          </span>
          <button
            className="rounded-md border border-slate-700 px-3 py-2 text-sm hover:bg-slate-800"
            type="button"
            onClick={goNextMonth}
          >
            {t("calendar.next")}
          </button>
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-[1fr_320px]">
        <div className="overflow-hidden rounded-lg border border-slate-800 bg-slate-900/70">
          <div className="grid grid-cols-7 border-b border-slate-800 text-center text-xs font-semibold uppercase tracking-wide text-slate-500">
            {dayHeaders.map((day) => (
              <div className="px-2 py-3" key={day}>
                {day}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7">
            {calendarDays.map((cell) => {
              const dayTasks = getTasksForDay(cell.date);
              const isSelected = isSameDay(cell.date, selectedDate);

              return (
                <button
                  className={`min-h-14 border-b border-r border-slate-800 p-1.5 text-left transition hover:bg-slate-800/70 ${
                    cell.isCurrentMonth
                      ? "bg-slate-900/40"
                      : "bg-slate-950/70 text-slate-600"
                  } ${isSelected ? "ring-1 ring-inset ring-sky-400" : ""}`}
                  key={cell.date.toISOString()}
                  type="button"
                  onClick={() => {
                    setSelectedDate(cell.date);
                    if (!cell.isCurrentMonth) {
                      setCurrentMonth(
                        new Date(
                          cell.date.getFullYear(),
                          cell.date.getMonth(),
                          1,
                        ),
                      );
                    }
                  }}
                >
                  <span
                    className={`text-sm font-medium ${
                      isToday(cell.date)
                        ? "text-sky-400"
                        : cell.isCurrentMonth
                          ? "text-slate-100"
                          : "text-slate-600"
                    }`}
                  >
                    {cell.date.getDate()}
                  </span>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {dayTasks.slice(0, 4).map((task) => {
                      const course = findCourse(courses, task.courseId);

                      return (
                        <span
                          className="h-2 w-2 rounded-full"
                          key={task.id}
                          style={{
                            backgroundColor: course?.color || "#38bdf8",
                          }}
                        />
                      );
                    })}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <aside className="rounded-lg border border-slate-800 bg-slate-900/70 p-4">
          <h3 className="mb-4 font-semibold text-slate-100">
            {selectedLabel}
          </h3>
          <div className="space-y-3">
            {selectedTasks.length > 0 ? (
              selectedTasks.map((task) => {
                const course = findCourse(courses, task.courseId);

                return (
                  <button
                    className="w-full rounded-md border border-slate-800 bg-slate-950 p-3 text-left hover:border-slate-600"
                    key={task.id}
                    type="button"
                    onClick={() => onEdit("tasks", task)}
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className="h-2.5 w-2.5 rounded-full"
                        style={{ backgroundColor: course?.color || "#64748b" }}
                      />
                      <p className="font-medium text-slate-100">
                        {task.title}
                      </p>
                    </div>
                    <p className="mt-1 text-xs text-slate-500">
                      {t(getStatusLabelKey(task.status))}
                    </p>
                  </button>
                );
              })
            ) : (
              <p className="text-sm text-slate-400">{t("calendar.noTasks")}</p>
            )}
          </div>
        </aside>
      </div>
    </section>
  );
}
