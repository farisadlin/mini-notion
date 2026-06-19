import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { STATUS_LABELS, STATUS_OPTIONS, TAG_PALETTE } from "../constants";

const inputClass =
  "w-full rounded border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none focus:border-sky-400";

const Field = ({ label, children, fullWidth = false }) => {
  return (
    <label className={`block space-y-1 ${fullWidth ? "sm:col-span-2" : ""}`}>
      <span className="text-xs font-medium uppercase tracking-wide text-slate-400">
        {label}
      </span>
      {children}
    </label>
  );
}

const getEmptyForm = (entity) => {
  if (entity === "tasks") {
    return {
      title: "",
      status: "To Do",
      deadline: "",
      courseId: "",
    };
  }

  if (entity === "courses") {
    return {
      name: "",
      credits: "",
      color: "#38bdf8",
      schedule: "",
      location: "",
    };
  }

  return {
    title: "",
    content: "",
    tags: [],
  };
}

const getFormFromItem = (entity, item) => {
  if (!item) {
    return getEmptyForm(entity);
  }

  if (entity === "tasks") {
    return {
      title: item.title || "",
      status: item.status || "To Do",
      deadline: item.deadline ? item.deadline.slice(0, 16) : "",
      courseId: item.courseId || "",
    };
  }

  if (entity === "courses") {
    return {
      name: item.name || "",
      credits: item.credits ?? "",
      color: item.color || "#38bdf8",
      schedule: item.schedule || "",
      location: item.location || "",
    };
  }

  return {
    title: item.title || "",
    content: item.content || "",
    tags: Array.isArray(item.tags)
      ? item.tags.map((tag) =>
          typeof tag === "string" ? { name: tag, color: "#38bdf8" } : tag
        )
      : [],
  };
}

const buildSavedItem = (entity, formData) => {
  if (entity === "tasks") {
    return {
      title: formData.title,
      status: formData.status,
      deadline: formData.deadline
        ? new Date(formData.deadline).toISOString()
        : "",
      courseId: formData.courseId || null,
    };
  }

  if (entity === "courses") {
    return {
      name: formData.name,
      credits: Number(formData.credits),
      color: formData.color,
      schedule: formData.schedule,
      location: formData.location,
    };
  }

  return {
    title: formData.title,
    content: formData.content,
    tags: formData.tags,
  };
}

const getEntityName = (entity, t) => {
  if (entity === "tasks") return t("entity.tasks");
  if (entity === "courses") return t("entity.courses");
  return t("entity.notes");
}

export default function FormView({
  entity,
  mode,
  item,
  courses = [],
  onSave,
  onCancel,
}) {
  const { t } = useTranslation();
  const [formData, setFormData] = useState(() => getFormFromItem(entity, item));
  const [newTagName, setNewTagName] = useState("");

  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    setFormData(getFormFromItem(entity, item));
    setNewTagName("");
  }, [entity, item]);
  /* eslint-enable react-hooks/set-state-in-effect */

  const updateField = (field, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  }

  const addTag = () => {
    const name = newTagName.trim();
    if (!name) return;

    const nextTag = {
      name,
      color: TAG_PALETTE[formData.tags.length % TAG_PALETTE.length],
    };

    updateField("tags", [...formData.tags, nextTag]);
    setNewTagName("");
  }

  const removeTag = (indexToRemove) => {
    updateField(
      "tags",
      formData.tags.filter((_, index) => index !== indexToRemove)
    );
  }

  const updateTagColor = (indexToUpdate, color) => {
    const nextTags = formData.tags.map((tag, index) => {
      if (index !== indexToUpdate) return tag;
      return { ...tag, color };
    });

    updateField("tags", nextTags);
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    onSave(entity, buildSavedItem(entity, formData));
  }

  const entityName = getEntityName(entity, t);
  const titleAction = mode === "create" ? t("modal.add") : t("modal.edit");

  return (
    <div className="rounded-lg border border-slate-700 bg-slate-900/80 p-4">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-semibold text-slate-50">
          {titleAction} {entityName}
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
            <Field label={t("column.title")}>
              <input
                className={inputClass}
                value={formData.title}
                onChange={(event) => updateField("title", event.target.value)}
              />
            </Field>

            <Field label={t("column.status")}>
              <select
                className={inputClass}
                value={formData.status}
                onChange={(event) => updateField("status", event.target.value)}
              >
                {STATUS_OPTIONS.map((status) => (
                  <option key={status} value={status}>
                    {t(STATUS_LABELS[status])}
                  </option>
                ))}
              </select>
            </Field>

            <Field label={t("column.deadline")}>
              <input
                className={inputClass}
                type="datetime-local"
                value={formData.deadline}
                onChange={(event) =>
                  updateField("deadline", event.target.value)
                }
              />
            </Field>

            <Field label={t("column.course")}>
              <select
                className={inputClass}
                value={formData.courseId}
                onChange={(event) =>
                  updateField("courseId", event.target.value)
                }
              >
                <option value="">{t("modal.noCourse")}</option>
                {courses.map((course) => (
                  <option key={course.id} value={course.id}>
                    {course.name}
                  </option>
                ))}
              </select>
            </Field>
          </>
        )}

        {entity === "courses" && (
          <>
            <Field label={t("column.name")}>
              <input
                className={inputClass}
                value={formData.name}
                onChange={(event) => updateField("name", event.target.value)}
              />
            </Field>

            <Field label={t("column.credits")}>
              <input
                className={inputClass}
                type="number"
                value={formData.credits}
                onChange={(event) => updateField("credits", event.target.value)}
              />
            </Field>

            <Field label={t("column.color")}>
              <input
                className="h-10 w-full rounded border border-slate-700 bg-slate-950 px-2"
                type="color"
                value={formData.color}
                onChange={(event) => updateField("color", event.target.value)}
              />
            </Field>

            <Field label={t("column.schedule")}>
              <input
                className={inputClass}
                value={formData.schedule}
                onChange={(event) =>
                  updateField("schedule", event.target.value)
                }
              />
            </Field>

            <Field label={t("column.location")} fullWidth>
              <input
                className={inputClass}
                value={formData.location}
                onChange={(event) =>
                  updateField("location", event.target.value)
                }
              />
            </Field>
          </>
        )}

        {entity === "notes" && (
          <>
            <Field label={t("column.title")} fullWidth>
              <input
                className={inputClass}
                value={formData.title}
                onChange={(event) => updateField("title", event.target.value)}
              />
            </Field>

            <Field label={t("column.content")} fullWidth>
              <textarea
                className={`min-h-24 ${inputClass}`}
                value={formData.content}
                onChange={(event) => updateField("content", event.target.value)}
              />
            </Field>

            <div className="space-y-2 sm:col-span-2">
              <span className="text-xs font-medium uppercase tracking-wide text-slate-400">
                {t("column.tags")}
              </span>

              <div className="flex gap-2">
                <input
                  className={`flex-1 ${inputClass}`}
                  placeholder={t("form.newTag")}
                  value={newTagName}
                  onChange={(event) => setNewTagName(event.target.value)}
                />
                <button
                  className="rounded bg-sky-500 px-3 py-2 text-sm font-semibold text-slate-950 hover:bg-sky-400"
                  type="button"
                  onClick={addTag}
                >
                  {t("form.addTag")}
                </button>
              </div>

              {formData.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.tags.map((tag, index) => (
                    <div
                      className="flex items-center gap-1 rounded-full bg-slate-800 py-1 pl-1 pr-2"
                      key={`${tag.name}-${index}`}
                    >
                      <input
                        className="h-5 w-5 cursor-pointer rounded-full border-0 p-0"
                        type="color"
                        value={tag.color}
                        onChange={(event) =>
                          updateTagColor(index, event.target.value)
                        }
                      />
                      <span className="text-xs text-slate-200">
                        {tag.name}
                      </span>
                      <button
                        className="ml-1 text-xs text-slate-400 hover:text-red-300"
                        type="button"
                        onClick={() => removeTag(index)}
                      >
                        x
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
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
