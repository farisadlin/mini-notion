import { useTranslation } from "react-i18next";

const findCourse = (courses, courseId) => {
  return courses.find((course) => course.id === courseId);
}

const formatDate = (value) => {
  if (!value) return "-";
  return new Date(value).toLocaleDateString();
}

const getEntityLabel = (entity, t) => {
  if (entity === "tasks") return t("entity.tasks");
  if (entity === "courses") return t("entity.coursesShort");
  return t("entity.notes");
}

const getRows = (entity, tasks, courses, notes) => {
  if (entity === "tasks") return tasks;
  if (entity === "courses") return courses;
  return notes;
}

export default function TableView({
  activeEntity,
  tasks,
  courses,
  notes,
  onEntityChange,
  onAdd,
  onEdit,
  onDelete,
}) {
  const { t } = useTranslation();
  const entity = activeEntity;
  const rows = getRows(entity, tasks, courses, notes);

  return (
    <section className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-semibold text-slate-50">
            {t("table.title")}
          </h2>
          <p className="text-sm text-slate-400">{t("table.subtitle")}</p>
        </div>
        <button
          className="rounded-md bg-sky-500 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-sky-400"
          type="button"
          onClick={() => onAdd(entity)}
        >
          {t("button.add")} {getEntityLabel(entity, t)}
        </button>
      </div>

      <div className="flex w-fit rounded-lg border border-slate-800 bg-slate-900 p-1">
        {["tasks", "courses", "notes"].map((key) => (
          <button
            className={`rounded-md px-3 py-2 text-sm ${entity === key ? "bg-slate-700 text-slate-50" : "text-slate-400 hover:text-slate-100"}`}
            key={key}
            type="button"
            onClick={() => onEntityChange(key)}
          >
            {getEntityLabel(key, t)}
          </button>
        ))}
      </div>

      <div className="overflow-hidden rounded-lg border border-slate-800 bg-slate-900/70">
        <div className="overflow-x-auto">
          <table className="w-full min-w-190 text-left text-sm">
            <thead className="border-b border-slate-800 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                {entity === "tasks" && (
                  <>
                    <th className="px-4 py-3">{t("column.title")}</th>
                    <th className="px-4 py-3">{t("column.status")}</th>
                    <th className="px-4 py-3">{t("column.deadline")}</th>
                    <th className="px-4 py-3">{t("column.course")}</th>
                    <th className="px-4 py-3">{t("table.actions")}</th>
                  </>
                )}
                {entity === "courses" && (
                  <>
                    <th className="px-4 py-3">{t("column.name")}</th>
                    <th className="px-4 py-3">{t("column.credits")}</th>
                    <th className="px-4 py-3">{t("column.schedule")}</th>
                    <th className="px-4 py-3">{t("column.location")}</th>
                    <th className="px-4 py-3">{t("table.actions")}</th>
                  </>
                )}
                {entity === "notes" && (
                  <>
                    <th className="px-4 py-3">{t("column.title")}</th>
                    <th className="px-4 py-3">{t("column.content")}</th>
                    <th className="px-4 py-3">{t("column.tags")}</th>
                    <th className="px-4 py-3">{t("column.createdAt")}</th>
                    <th className="px-4 py-3">{t("table.actions")}</th>
                  </>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {rows.map((item) => (
                <tr className="hover:bg-slate-900" key={item.id}>
                  {entity === "tasks" && (
                    <>
                      <td className="px-4 py-3 font-medium text-slate-200">
                        {item.title}
                      </td>
                      <td className="px-4 py-3">
                        <span className="rounded-full bg-slate-800 px-2 py-0.5 text-xs text-slate-300">
                          {item.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-slate-400">
                        {formatDate(item.deadline)}
                      </td>
                      <td className="px-4 py-3 text-slate-400">
                        {findCourse(courses, item.courseId)?.name || "-"}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <button
                            className="rounded-md border border-slate-700 px-2 py-1 text-xs text-slate-200 hover:bg-slate-800"
                            type="button"
                            onClick={() => onEdit("tasks", item)}
                          >
                            {t("button.edit")}
                          </button>
                          <button
                            className="rounded-md border border-red-500/50 px-2 py-1 text-xs text-red-200 hover:bg-red-500/10"
                            type="button"
                            onClick={() => onDelete("tasks", item.id)}
                          >
                            {t("button.delete")}
                          </button>
                        </div>
                      </td>
                    </>
                  )}
                  {entity === "courses" && (
                    <>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <span
                            className="h-3 w-3 rounded-full"
                            style={{ backgroundColor: item.color }}
                          />
                          <span className="text-slate-200">{item.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-slate-400">
                        {item.credits} SKS
                      </td>
                      <td className="px-4 py-3 text-slate-400">
                        {item.schedule || "-"}
                      </td>
                      <td className="px-4 py-3 text-slate-400">
                        {item.location || "-"}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <button
                            className="rounded-md border border-slate-700 px-2 py-1 text-xs text-slate-200 hover:bg-slate-800"
                            type="button"
                            onClick={() => onEdit("courses", item)}
                          >
                            {t("button.edit")}
                          </button>
                          <button
                            className="rounded-md border border-red-500/50 px-2 py-1 text-xs text-red-200 hover:bg-red-500/10"
                            type="button"
                            onClick={() => onDelete("courses", item.id)}
                          >
                            {t("button.delete")}
                          </button>
                        </div>
                      </td>
                    </>
                  )}
                  {entity === "notes" && (
                    <>
                      <td className="px-4 py-3 font-medium text-slate-200">
                        {item.title}
                      </td>
                      <td className="max-w-xs truncate px-4 py-3 text-slate-400">
                        {item.content}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-1">
                          {item.tags.map((tag, index) => (
                            <span
                              className="rounded-full bg-slate-800 px-2 py-0.5 text-xs text-slate-300"
                              key={`${tag.name}-${index}`}
                            >
                              {tag.name}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-xs text-slate-400">
                        {formatDate(item.createdAt)}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <button
                            className="rounded-md border border-slate-700 px-2 py-1 text-xs text-slate-200 hover:bg-slate-800"
                            type="button"
                            onClick={() => onEdit("notes", item)}
                          >
                            {t("button.edit")}
                          </button>
                          <button
                            className="rounded-md border border-red-500/50 px-2 py-1 text-xs text-red-200 hover:bg-red-500/10"
                            type="button"
                            onClick={() => onDelete("notes", item.id)}
                          >
                            {t("button.delete")}
                          </button>
                        </div>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
