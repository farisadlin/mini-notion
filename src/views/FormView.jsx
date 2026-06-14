import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { statusOptions as defaultStatusOptions } from "../data/dummyData";

const statusLabels = {
  "To Do": "status.todo",
  "In Progress": "status.inProgress",
  Selesai: "status.done",
};

function FormView({
  entity,
  mode,
  item,
  courses = [],
  statusOptions = defaultStatusOptions,
  onSave,
  onCancel,
}) {
  const { t } = useTranslation();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [status, setStatus] = useState("To Do");
  const [deadline, setDeadline] = useState("");
  const [courseId, setCourseId] = useState("");
  const [name, setName] = useState("");
  const [credits, setCredits] = useState("");
  const [color, setColor] = useState("#38bdf8");
  const [schedule, setSchedule] = useState("");
  const [location, setLocation] = useState("");
  const [tags, setTags] = useState("");

  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    if (mode === "edit" && item) {
      setTitle(item.title || "");
      setContent(item.content || "");
      setStatus(item.status || "To Do");
      setDeadline(item.deadline ? item.deadline.slice(0, 16) : "");
      setCourseId(item.courseId || "");
      setName(item.name || "");
      setCredits(item.credits || "");
      setColor(item.color || "#38bdf8");
      setSchedule(item.schedule || "");
      setLocation(item.location || "");
      setTags(Array.isArray(item.tags) ? item.tags.join(", ") : item.tags || "");
      return;
    }

    setTitle("");
    setContent("");
    setStatus("To Do");
    setDeadline("");
    setCourseId("");
    setName("");
    setCredits("");
    setColor("#38bdf8");
    setSchedule("");
    setLocation("");
    setTags("");
  }, [mode, item]);
  /* eslint-enable react-hooks/set-state-in-effect */

  function handleSubmit(event) {
    event.preventDefault();
    const values = {};

    if (entity === "tasks") {
      values.title = title;
      values.status = status;
      values.deadline = deadline ? new Date(deadline).toISOString() : "";
      values.courseId = courseId || null;
    } else if (entity === "courses") {
      values.name = name;
      values.credits = Number(credits);
      values.color = color;
      values.schedule = schedule;
      values.location = location;
    } else if (entity === "notes") {
      values.title = title;
      values.content = content;
      values.tags = tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean);
    }

    onSave(entity, values);
    onCancel();
  }

  const entityName =
    entity === "tasks"
      ? t("entity.tasks")
      : entity === "courses"
        ? t("entity.courses")
        : t("entity.notes");
  const buttonLabel = mode === "create" ? t("modal.add") : t("modal.edit");

  return (
    <div className="rounded-lg border border-slate-700 bg-slate-900/80 p-4">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-semibold text-slate-50">
          {buttonLabel} {entityName}
        </h3>
        <button
          className="text-sm text-slate-400 hover:text-slate-100"
          type="button"
          onClick={onCancel}
        >
          {t("modal.close")}
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        {entity === "tasks" && (
          <>
            <input
              className="w-full rounded border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none focus:border-sky-400"
              placeholder={t("column.title")}
              value={title}
              onChange={(event) => setTitle(event.target.value)}
            />
            <select
              className="w-full rounded border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none focus:border-sky-400"
              value={status}
              onChange={(event) => setStatus(event.target.value)}
            >
              {statusOptions.map((option) => (
                <option key={option} value={option}>
                  {t(statusLabels[option])}
                </option>
              ))}
            </select>
            <input
              className="w-full rounded border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none focus:border-sky-400"
              type="datetime-local"
              value={deadline}
              onChange={(event) => setDeadline(event.target.value)}
            />
            <select
              className="w-full rounded border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none focus:border-sky-400"
              value={courseId}
              onChange={(event) => setCourseId(event.target.value)}
            >
              <option value="">{t("modal.noCourse")}</option>
              {courses.map((course) => (
                <option key={course.id} value={course.id}>
                  {course.name}
                </option>
              ))}
            </select>
          </>
        )}

        {entity === "courses" && (
          <>
            <input
              className="w-full rounded border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none focus:border-sky-400"
              placeholder={t("column.name")}
              value={name}
              onChange={(event) => setName(event.target.value)}
            />
            <input
              className="w-full rounded border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none focus:border-sky-400"
              type="number"
              placeholder={t("column.credits")}
              value={credits}
              onChange={(event) => setCredits(event.target.value)}
            />
            <input
              className="h-10 w-full rounded border border-slate-700 bg-slate-950 px-2"
              type="color"
              value={color}
              onChange={(event) => setColor(event.target.value)}
            />
            <input
              className="w-full rounded border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none focus:border-sky-400"
              placeholder={t("column.schedule")}
              value={schedule}
              onChange={(event) => setSchedule(event.target.value)}
            />
            <input
              className="w-full rounded border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none focus:border-sky-400"
              placeholder={t("column.location")}
              value={location}
              onChange={(event) => setLocation(event.target.value)}
            />
          </>
        )}

        {entity === "notes" && (
          <>
            <input
              className="w-full rounded border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none focus:border-sky-400"
              placeholder={t("column.title")}
              value={title}
              onChange={(event) => setTitle(event.target.value)}
            />
            <textarea
              className="min-h-24 w-full rounded border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none focus:border-sky-400"
              placeholder={t("column.content")}
              value={content}
              onChange={(event) => setContent(event.target.value)}
            />
            <input
              className="w-full rounded border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none focus:border-sky-400"
              placeholder="tag1, tag2, tag3"
              value={tags}
              onChange={(event) => setTags(event.target.value)}
            />
          </>
        )}

        <div className="flex gap-2 pt-1">
          <button
            className="rounded bg-sky-500 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-sky-400"
            type="submit"
          >
            {t("modal.save")}
          </button>
          <button
            className="rounded border border-slate-700 px-4 py-2 text-sm text-slate-200 hover:bg-slate-800"
            type="button"
            onClick={onCancel}
          >
            {t("modal.cancel")}
          </button>
        </div>
      </form>
    </div>
  );
}

export default FormView;
