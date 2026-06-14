import { useTranslation } from "react-i18next";
import i18n from "../i18n";
import { NAV_ITEMS } from "../constants";

function Sidebar({
  activeView,
  courses,
  selectedCourseId,
  onNavigate,
  onQuickAdd,
  onSelectCourse,
  onClearCourse,
}) {
  const { t } = useTranslation();

  return (
    <aside className="border-b border-slate-800 bg-slate-950/95 lg:fixed lg:inset-y-0 lg:left-0 lg:z-40 lg:w-72 lg:border-b-0 lg:border-r">
      <div className="flex h-full flex-col gap-5 px-4 py-5">
        <div>
          <h1 className="text-xl font-bold text-slate-50">{t("app.name")}</h1>
          <p className="mt-1 text-sm text-slate-400">{t("app.tagline")}</p>
        </div>

        <nav className="grid grid-cols-2 gap-2 lg:grid-cols-1">
          {NAV_ITEMS.map(([id, labelKey]) => (
            <button
              className={`rounded-md px-3 py-2 text-left text-sm font-medium transition ${activeView === id ? "bg-slate-800 text-sky-200" : "text-slate-300 hover:bg-slate-900 hover:text-slate-50"}`}
              key={id}
              type="button"
              onClick={() => onNavigate(id)}
            >
              {t(labelKey)}
            </button>
          ))}
        </nav>

        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            {t("quickAdd")}
          </p>
          <div className="grid grid-cols-3 gap-2 lg:grid-cols-1">
            <button
              className="rounded-md bg-sky-500 px-3 py-2 text-sm font-semibold text-slate-950 hover:bg-sky-400"
              type="button"
              onClick={() => onQuickAdd("tasks")}
            >
              {t("quickAdd.task")}
            </button>
            <button
              className="rounded-md bg-emerald-400 px-3 py-2 text-sm font-semibold text-slate-950 hover:bg-emerald-300"
              type="button"
              onClick={() => onQuickAdd("courses")}
            >
              {t("quickAdd.course")}
            </button>
            <button
              className="rounded-md bg-violet-400 px-3 py-2 text-sm font-semibold text-slate-950 hover:bg-violet-300"
              type="button"
              onClick={() => onQuickAdd("notes")}
            >
              {t("quickAdd.note")}
            </button>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between gap-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              {t("sidebar.courses")}
            </p>
            {selectedCourseId && (
              <button
                className="text-xs text-slate-400 hover:text-slate-100"
                type="button"
                onClick={onClearCourse}
              >
                {t("sidebar.all")}
              </button>
            )}
          </div>
          <div className="space-y-1">
            {courses.map((course) => (
              <button
                className={`flex w-full items-center gap-3 rounded-md px-3 py-2 text-left text-sm ${selectedCourseId === course.id ? "bg-slate-800 text-slate-50" : "text-slate-300 hover:bg-slate-900"}`}
                key={course.id}
                type="button"
                onClick={() => onSelectCourse(course.id)}
              >
                <span
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ backgroundColor: course.color }}
                />
                <span className="min-w-0 truncate">{course.name}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="border-t border-slate-800 pt-4">
          <button
            className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-slate-400 hover:bg-slate-900 hover:text-slate-100"
            type="button"
            onClick={() =>
              i18n.changeLanguage(i18n.language === "id" ? "en" : "id")
            }
          >
            <span>
              {t("language")}:{" "}
              {i18n.language === "id" ? "Indonesia" : "English"}
            </span>
          </button>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
