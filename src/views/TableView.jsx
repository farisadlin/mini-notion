import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import PropertyInput from '../components/PropertyInput'

const configs = {
  tasks: [
    ['title', 'column.title', 'text'],
    ['status', 'column.status', 'status'],
    ['deadline', 'column.deadline', 'date'],
    ['courseId', 'column.courseId', 'course'],
    ['createdAt', 'column.createdAt', 'readonly'],
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
    ['content', 'column.content', 'text'],
    ['tags', 'column.tags', 'text'],
    ['createdAt', 'column.createdAt', 'readonly'],
  ],
}

const labelKeys = { tasks: 'entity.tasks', courses: 'entity.coursesShort', notes: 'entity.notes' }
const addLabelKeys = { tasks: 'table.addTasks', courses: 'table.addCourses', notes: 'table.addNotes' }

function displayValue(entity, key, item, courses, t) {
  if (key === 'courseId') return courses.find((course) => course.id === item.courseId)?.name || t('dashboard.noCourse')
  if (key === 'deadline' || key === 'createdAt') return item[key] ? new Date(item[key]).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' }) : '-'
  if (key === 'tags') return item.tags?.join(', ') || '-'
  return item[key] || '-'
}

function TableView({ tasks, courses, notes, onAdd, onEdit, onUpdate, onDelete }) {
  const { t } = useTranslation()
  const [entity, setEntity] = useState('tasks')
  const [editing, setEditing] = useState(null)
  const [draft, setDraft] = useState('')
  const [filter, setFilter] = useState('')
  const [sort, setSort] = useState({ key: 'title', direction: 'asc' })

  const source = { tasks, courses, notes }[entity]
  const rows = useMemo(() => {
    const needle = filter.toLowerCase()
    return [...source]
      .filter((item) => JSON.stringify(item).toLowerCase().includes(needle))
      .sort((a, b) => {
        const av = String(Array.isArray(a[sort.key]) ? a[sort.key].join(', ') : a[sort.key] ?? '')
        const bv = String(Array.isArray(b[sort.key]) ? b[sort.key].join(', ') : b[sort.key] ?? '')
        return sort.direction === 'asc' ? av.localeCompare(bv) : bv.localeCompare(av)
      })
  }, [source, filter, sort])

  const startEdit = (item, key) => {
    setEditing({ id: item.id, key })
    setDraft(Array.isArray(item[key]) ? item[key].join(', ') : item[key] ?? '')
  }

  const commit = () => {
    if (!editing) return
    const type = configs[entity].find(([key]) => key === editing.key)?.[2]
    const value = editing.key === 'tags' ? String(draft).split(',').map((tag) => tag.trim()).filter(Boolean) : draft
    onUpdate(entity, editing.id, { [editing.key]: type === 'number' ? Number(value) : value })
    setEditing(null)
  }

  const toggleSort = (key) => setSort((current) => ({
    key,
    direction: current.key === key && current.direction === 'asc' ? 'desc' : 'asc',
  }))

  return (
    <section className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-semibold text-slate-50">{t('table.title')}</h2>
          <p className="text-sm text-slate-400">{t('table.subtitle')}</p>
        </div>
        <button className="rounded-md bg-sky-500 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-sky-400" type="button" onClick={() => onAdd(entity)}>{t(addLabelKeys[entity])}</button>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="flex rounded-lg border border-slate-800 bg-slate-900 p-1">
          {Object.entries(labelKeys).map(([id, labelKey]) => (
            <button className={`rounded-md px-3 py-2 text-sm ${entity === id ? 'bg-slate-700 text-slate-50' : 'text-slate-400 hover:text-slate-100'}`} key={id} type="button" onClick={() => setEntity(id)}>{t(labelKey)}</button>
          ))}
        </div>
        <input className="min-w-56 flex-1 rounded-md border border-slate-800 bg-slate-900 px-3 py-2 text-sm text-slate-100 outline-none focus:border-sky-400" value={filter} placeholder={t('table.filter')} onChange={(event) => setFilter(event.target.value)} />
      </div>

      <div className="overflow-hidden rounded-lg border border-slate-800 bg-slate-900/70">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="border-b border-slate-800 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                {configs[entity].map(([key, labelKey]) => (
                  <th className="px-4 py-3" key={key}>
                    <button className="font-semibold hover:text-slate-200" type="button" onClick={() => toggleSort(key)}>{t(labelKey)}</button>
                  </th>
                ))}
                <th className="px-4 py-3">{t('table.actions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {rows.map((item) => (
                <tr className="hover:bg-slate-900" key={item.id}>
                  {configs[entity].map(([key, , type]) => (
                    <td className="max-w-72 px-4 py-3 align-top" key={key}>
                      {editing?.id === item.id && editing?.key === key ? (
                        <div onBlur={commit}>
                          <PropertyInput type={type} value={draft} courses={courses} onChange={setDraft} />
                        </div>
                      ) : (
                        <button
                          className="flex max-w-full items-center gap-2 text-left text-slate-200"
                          type="button"
                          disabled={type === 'readonly'}
                          onClick={() => type !== 'readonly' && startEdit(item, key)}
                        >
                          {key === 'courseId' && item.courseId && <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: courses.find((course) => course.id === item.courseId)?.color }} />}
                          {key === 'color' && <span className="h-3 w-3 rounded-full" style={{ backgroundColor: item.color }} />}
                          <span className="truncate">{displayValue(entity, key, item, courses, t)}</span>
                        </button>
                      )}
                    </td>
                  ))}
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button className="rounded-md border border-slate-700 px-2 py-1 text-xs text-slate-200 hover:bg-slate-800" type="button" onClick={() => onEdit(entity, item)}>{t('button.edit')}</button>
                      <button className="rounded-md border border-red-500/50 px-2 py-1 text-xs text-red-200 hover:bg-red-500/10" type="button" onClick={() => onDelete(entity, item.id)}>{t('button.delete')}</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}

export default TableView
