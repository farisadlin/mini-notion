import { useState } from "react";
import { useTranslation } from "react-i18next";
import { TAG_PALETTE } from "../constants";

/**
 * Reusable form field that renders different input types.
 *
 * Props:
 *  - label: i18n key for the label text
 *  - type: "text" | "number" | "date" | "select" | "color" | "textarea" | "courseSelect" | "tags"
 *  - value: current value
 *  - onChange: (newValue) => void
 *  - options: array of { value, label } for type="select"
 *  - courses: array of course objects for type="courseSelect"
 *  - tags: array of { name, color } for type="tags"
 *  - onTagsChange: (newTags) => void for type="tags"
 *  - placeholder: string (optional)
 *  - spanFull: boolean — if true, applies sm:col-span-2
 *  - className: additional wrapper classes
 */
function PropertyInput({
  label,
  type = "text",
  value,
  onChange,
  options = [],
  courses = [],
  tags = [],
  onTagsChange,
  placeholder,
  spanFull,
  className = "",
}) {
  const { t } = useTranslation();
  const [newTagName, setNewTagName] = useState("");

  const baseClass =
    "w-full rounded border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none focus:border-sky-400";
  const wrapperClass = `${spanFull ? "sm:col-span-2" : ""} ${className}`;

  function renderInput() {
    switch (type) {
      /* ─── TEXT ─────────────────────── */
      case "text":
        return (
          <input
            className={baseClass}
            value={value ?? ""}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
          />
        );

      /* ─── NUMBER ────────────────────── */
      case "number":
        return (
          <input
            className={baseClass}
            type="number"
            value={value ?? ""}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
          />
        );

      /* ─── DATE ──────────────────────── */
      case "date":
        return (
          <input
            className={baseClass}
            type="datetime-local"
            value={value ?? ""}
            onChange={(e) => onChange(e.target.value)}
          />
        );

      /* ─── SELECT ────────────────────── */
      case "select":
        return (
          <select
            className={baseClass}
            value={value ?? ""}
            onChange={(e) => onChange(e.target.value)}
          >
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        );

      /* ─── COLOR ─────────────────────── */
      case "color":
        return (
          <input
            className="h-10 w-full rounded border border-slate-700 bg-slate-950 px-2"
            type="color"
            value={value ?? "#38bdf8"}
            onChange={(e) => onChange(e.target.value)}
          />
        );

      /* ─── TEXTAREA ───────────────────── */
      case "textarea":
        return (
          <textarea
            className={`min-h-24 ${baseClass}`}
            value={value ?? ""}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
          />
        );

      /* ─── COURSE SELECT ──────────────── */
      case "courseSelect":
        return (
          <select
            className={baseClass}
            value={value ?? ""}
            onChange={(e) => onChange(e.target.value)}
          >
            <option value="">{t("modal.noCourse")}</option>
            {courses.map((course) => (
              <option key={course.id} value={course.id}>
                {course.name}
              </option>
            ))}
          </select>
        );

      /* ─── TAGS ───────────────────────── */
      case "tags":
        return (
          <div className="space-y-2">
            <div className="flex gap-2">
              <input
                className={`flex-1 ${baseClass}`}
                placeholder="New tag name"
                value={newTagName}
                onChange={(e) => setNewTagName(e.target.value)}
              />
              <button
                className="rounded bg-sky-500 px-3 py-2 text-sm font-semibold text-slate-950 hover:bg-sky-400"
                type="button"
                onClick={() => {
                  if (newTagName.trim()) {
                    onTagsChange?.([
                      ...tags,
                      {
                        name: newTagName.trim(),
                        color: TAG_PALETTE[tags.length % TAG_PALETTE.length],
                      },
                    ]);
                    setNewTagName("");
                  }
                }}
              >
                Add
              </button>
            </div>
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {tags.map((tag, index) => (
                  <div
                    className="flex items-center gap-1 rounded-full bg-slate-800 py-1 pl-1 pr-2"
                    key={`${tag.name}-${index}`}
                  >
                    <input
                      type="color"
                      value={tag.color}
                      onChange={(e) => {
                        const next = [...tags];
                        next[index] = { ...next[index], color: e.target.value };
                        onTagsChange?.(next);
                      }}
                      className="h-5 w-5 cursor-pointer rounded-full border-0 p-0"
                    />
                    <span className="text-xs text-slate-200">{tag.name}</span>
                    <button
                      type="button"
                      className="ml-1 text-xs text-slate-400 hover:text-red-300"
                      onClick={() =>
                        onTagsChange?.(tags.filter((_, i) => i !== index))
                      }
                    >
                      x
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      default:
        return (
          <input
            className={baseClass}
            value={value ?? ""}
            onChange={(e) => onChange(e.target.value)}
          />
        );
    }
  }

  if (type === "tags") {
    return <div className={wrapperClass}>{renderInput()}</div>;
  }

  return (
    <div className={wrapperClass}>
      <label className="block space-y-1">
        <span className="text-xs font-medium uppercase tracking-wide text-slate-400">
          {label}
        </span>
        {renderInput()}
      </label>
    </div>
  );
}

export default PropertyInput;
