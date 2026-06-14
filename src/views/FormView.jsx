import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { STATUS_OPTIONS, STATUS_LABELS } from "../constants";
import PropertyInput from "../components/PropertyInput";

function FormView({
  entity,
  mode,
  item,
  courses = [],
  statusOptions = STATUS_OPTIONS,
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
  const [tags, setTags] = useState([]);

  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    const empty = () => {
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
      setTags([]);
    };

    if (mode !== "edit" || !item) {
      empty();
      return;
    }

    setTitle(item.title || "");
    setContent(item.content || "");
    setStatus(item.status || "To Do");
    setDeadline(item.deadline ? item.deadline.slice(0, 16) : "");
    setCourseId(item.courseId || "");
    setName(item.name || "");
    setCredits(item.credits ?? "");
    setColor(item.color || "#38bdf8");
    setSchedule(item.schedule || "");
    setLocation(item.location || "");
    setTags(
      Array.isArray(item.tags)
        ? item.tags.map((tag) =>
            typeof tag === "string" ? { name: tag, color: "#38bdf8" } : tag,
          )
        : [],
    );
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
      values.tags = tags;
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

  const statusSelectOptions = statusOptions.map((opt) => ({
    value: opt,
    label: t(STATUS_LABELS[opt]),
  }));

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

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 gap-x-4 gap-y-3 sm:grid-cols-2"
      >
        {entity === "tasks" && (
          <>
            <PropertyInput
              label={t("column.title")}
              value={title}
              onChange={setTitle}
            />
            <PropertyInput
              label={t("column.status")}
              type="select"
              value={status}
              onChange={setStatus}
              options={statusSelectOptions}
            />
            <PropertyInput
              label={t("column.deadline")}
              type="date"
              value={deadline}
              onChange={setDeadline}
            />
            <PropertyInput
              label={t("column.course")}
              type="courseSelect"
              value={courseId}
              onChange={setCourseId}
              courses={courses}
            />
          </>
        )}

        {entity === "courses" && (
          <>
            <PropertyInput
              label={t("column.name")}
              value={name}
              onChange={setName}
            />
            <PropertyInput
              label={t("column.credits")}
              type="number"
              value={credits}
              onChange={setCredits}
            />
            <PropertyInput
              label={t("column.color")}
              type="color"
              value={color}
              onChange={setColor}
            />
            <PropertyInput
              label={t("column.schedule")}
              value={schedule}
              onChange={setSchedule}
            />
            <PropertyInput
              label={t("column.location")}
              value={location}
              onChange={setLocation}
              spanFull
            />
          </>
        )}

        {entity === "notes" && (
          <>
            <PropertyInput
              label={t("column.title")}
              value={title}
              onChange={setTitle}
              spanFull
            />
            <PropertyInput
              label={t("column.content")}
              type="textarea"
              value={content}
              onChange={setContent}
              spanFull
            />
            <PropertyInput
              label={t("column.tags")}
              type="tags"
              tags={tags}
              onTagsChange={setTags}
              spanFull
            />
          </>
        )}

        <div className="flex gap-2 pt-1 sm:col-span-2">
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
