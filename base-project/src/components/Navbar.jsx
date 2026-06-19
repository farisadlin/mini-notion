import { useTranslation } from "react-i18next";
import i18n from "../i18n";
import { NAV_ITEMS } from "../constants";

export default function Navbar({ activeView, onNavigate, onQuickAdd }) {
  const { t } = useTranslation();

  return (
    <header className="sticky top-0 z-50 border-b border-slate-800 bg-slate-950/95 backdrop-blur-sm">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6">
        <h1 className="text-lg font-bold text-slate-50">
          {t("app.name")}
        </h1>

        <nav className="flex flex-wrap gap-1">
          {NAV_ITEMS.map(([id, labelKey]) => (
            <button
              className={`rounded-md px-3 py-1.5 text-sm font-medium transition ${
                activeView === id
                  ? "bg-slate-800 text-sky-200"
                  : "text-slate-400 hover:bg-slate-900 hover:text-slate-100"
              }`}
              key={id}
              type="button"
              onClick={() => onNavigate(id)}
            >
              {t(labelKey)}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <div className="hidden gap-1 sm:flex">
            <button
              className="rounded-md bg-sky-500/20 px-2.5 py-1.5 text-xs font-medium text-sky-300 hover:bg-sky-500/30"
              type="button"
              onClick={() => onQuickAdd("tasks")}
            >
              +{t("quickAdd.task")}
            </button>
            <button
              className="rounded-md bg-emerald-500/20 px-2.5 py-1.5 text-xs font-medium text-emerald-300 hover:bg-emerald-500/30"
              type="button"
              onClick={() => onQuickAdd("courses")}
            >
              +{t("quickAdd.course")}
            </button>
            <button
              className="rounded-md bg-violet-500/20 px-2.5 py-1.5 text-xs font-medium text-violet-300 hover:bg-violet-500/30"
              type="button"
              onClick={() => onQuickAdd("notes")}
            >
              +{t("quickAdd.note")}
            </button>
          </div>
          <button
            className="rounded-md px-2 py-1.5 text-base"
            type="button"
            onClick={() => i18n.changeLanguage(i18n.language === "id" ? "en" : "id")}
          >
            {i18n.language === "id" ? "🇮🇩" : "🇬🇧"}
          </button>
        </div>
      </div>
    </header>
  );
}
