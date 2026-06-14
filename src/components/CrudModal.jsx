import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import PropertyInput from './PropertyInput'

const fields = {
  tasks: [
    ['title', 'column.title', 'text'],
    ['status', 'column.status', 'status'],
    ['deadline', 'column.deadline', 'date'],
    ['courseId', 'column.courseId', 'course'],
  ],
  courses: [
    ['name', 'column.name', 'text'],
    ['credits', 'column.credits', 'number'],
    ['color', 'column.color', 'color'],
    ['schedule', 'column.schedule', 'text'],
    ['location', 'column.location', 'text'],
  ],
  notes: [
    ['title', 'column.title', 'text'],
    ['content', 'column.content', 'textarea'],
    ['tags', 'column.tags', 'text'],
  ],
}

const entityLabelKeys = {
  tasks: 'entity.tasks',
  courses: 'entity.courses',
  notes: 'entity.notes',
}

function CrudModal({ entity, mode, item, courses, onClose, onSave }) {
  const { t } = useTranslation()
  const [form, setForm] = useState(() => ({
    ...(item || {}),
    tags: Array.isArray(item?.tags) ? item.tags.join(', ') : item?.tags || '',
  }))

  const setField = (key, value) => setForm((current) => ({ ...current, [key]: value }))

  const submit = (event) => {
    event.preventDefault()
    const values = {
      ...form,
      tags: entity === 'notes' ? String(form.tags || '').split(',').map((tag) => tag.trim()).filter(Boolean) : form.tags,
    }
    onSave(values)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 px-4 backdrop-blur-sm">
      <form className="w-full max-w-lg rounded-lg border border-slate-700 bg-slate-900 p-5 shadow-2xl" onSubmit={submit}>
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-slate-50">{mode === 'create' ? t('modal.add') : t('modal.edit')} {t(entityLabelKeys[entity])}</h2>
            <p className="text-sm text-slate-400">{t('modal.subtitle')}</p>
          </div>
          <button className="rounded-md px-2 py-1 text-slate-400 hover:bg-slate-800 hover:text-slate-100" type="button" onClick={onClose}>{t('modal.close')}</button>
        </div>

        <div className="space-y-4">
          {fields[entity].map(([key, labelKey, type]) => (
            <label className="block space-y-2" key={key}>
              <span className="text-xs font-medium uppercase tracking-wide text-slate-400">{t(labelKey)}</span>
              <PropertyInput type={type} value={form[key]} courses={courses} onChange={(value) => setField(key, value)} />
            </label>
          ))}
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button className="rounded-md border border-slate-700 px-4 py-2 text-sm text-slate-200 hover:bg-slate-800" type="button" onClick={onClose}>{t('modal.cancel')}</button>
          <button className="rounded-md bg-sky-500 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-sky-400" type="submit">{t('modal.save')}</button>
        </div>
      </form>
    </div>
  )
}

export default CrudModal
