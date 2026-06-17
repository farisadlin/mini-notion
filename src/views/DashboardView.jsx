import { differenceInHours, isAfter, isBefore } from "date-fns";
import { useTranslation } from "react-i18next";

function findCourse(courses, courseId) {
  return courses.find((course) => course.id === courseId);
}

function getCompletionPercent(done, total) {
  if (total === 0) return 0;
  return Math.round((done / total) * 100);
}

function DashboardView({ tasks, allTasks, courses }) {
  const { t, i18n } = useTranslation();
  const weekday = new Date().toLocaleDateString("en-US", { weekday: "long" });
  const displayWeekday = new Date().toLocaleDateString(
    i18n.language === "id" ? "id-ID" : "en-US",
    { weekday: "long" },
  );
  const todayCourses = courses.filter((course) =>
    course.schedule.toLowerCase().includes(weekday.toLowerCase()),
  );
  const now = new Date();
  const in24h = new Date(now.getTime() + 24 * 60 * 60 * 1000);
  const urgentTasks = tasks
    .filter((task) => task.deadline && task.status !== "Selesai")
    .filter((task) => {
      const deadline = new Date(task.deadline);
      return isAfter(deadline, now) && isBefore(deadline, in24h);
    })
    .sort((a, b) => new Date(a.deadline) - new Date(b.deadline));

  const completed = tasks.filter((task) => task.status === "Selesai").length;
  const percent = getCompletionPercent(completed, tasks.length);

  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-slate-50">
          {t("dashboard.title")}
        </h2>
        <p className="text-sm text-slate-400">{t("dashboard.subtitle")}</p>
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.15fr_1fr]">
        <div className="rounded-lg border border-slate-800 bg-slate-900/70 p-4">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-semibold text-slate-100">
              {t("dashboard.dailySummary")}
            </h3>
            <span className="text-sm text-slate-400">{displayWeekday}</span>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {todayCourses.length ? (
              todayCourses.map((course) => (
                <article
                  className="rounded-md border border-slate-800 bg-slate-950 p-3"
                  key={course.id}
                >
                  <div className="flex items-center gap-2">
                    <span
                      className="h-2.5 w-2.5 rounded-full"
                      style={{ backgroundColor: course.color }}
                    />
                    <h4 className="font-medium text-slate-100">
                      {course.name}
                    </h4>
                  </div>
                  <p className="mt-2 text-sm text-slate-400">
                    {course.schedule}
                  </p>
                  <p className="text-sm text-slate-500">{course.location}</p>
                </article>
              ))
            ) : (
              <p className="text-sm text-slate-400">
                {t("dashboard.noSchedule")}
              </p>
            )}
          </div>
        </div>

        <div className="rounded-lg border border-slate-800 bg-slate-900/70 p-4">
          <h3 className="mb-4 font-semibold text-slate-100">
            {t("dashboard.urgentAlert")}
          </h3>
          <div className="space-y-3">
            {urgentTasks.length ? (
              urgentTasks.map((task) => {
                const hours = Math.max(
                  0,
                  differenceInHours(new Date(task.deadline), now),
                );
                const course = findCourse(courses, task.courseId);
                return (
                  <article
                    className={`rounded-md border p-3 ${hours < 6 ? "border-red-500/50 bg-red-500/10" : "border-yellow-400/50 bg-yellow-400/10"}`}
                    key={task.id}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <p className="font-medium text-slate-100">{task.title}</p>
                      <span className="text-xs font-semibold text-slate-200">
                        {t("dashboard.hoursAbbr", { hours })}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-slate-400">
                      {course?.name || t("dashboard.noCourse")}
                    </p>
                  </article>
                );
              })
            ) : (
              <p className="text-sm text-slate-400">
                {t("dashboard.noUrgent")}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="rounded-lg border border-slate-800 bg-slate-900/70 p-4">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="font-semibold text-slate-100">
            {t("dashboard.progressTracker")}
          </h3>
          <span className="text-sm text-slate-400">
            {t("dashboard.tasksCompleted", { completed, total: tasks.length })}
          </span>
        </div>
        <div className="h-3 overflow-hidden rounded-full bg-slate-800">
          <div
            className="h-full rounded-full bg-sky-400"
            style={{ width: `${percent}%` }}
          />
        </div>
        <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {courses.map((course) => {
            const courseTasks = allTasks.filter(
              (task) => task.courseId === course.id,
            );
            const done = courseTasks.filter(
              (task) => task.status === "Selesai",
            ).length;
            const coursePercent = getCompletionPercent(
              done,
              courseTasks.length,
            );
            return (
              <article
                className="rounded-md border border-slate-800 bg-slate-950 p-3"
                key={course.id}
              >
                <div className="mb-2 flex items-center gap-2">
                  <span
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: course.color }}
                  />
                  <p className="truncate text-sm font-medium text-slate-100">
                    {course.name}
                  </p>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-slate-800">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${coursePercent}%`,
                      backgroundColor: course.color,
                    }}
                  />
                </div>
                <p className="mt-2 text-xs text-slate-500">
                  {done} {t("dashboard.of")} {courseTasks.length}{" "}
                  {t("dashboard.done")}
                </p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default DashboardView;
