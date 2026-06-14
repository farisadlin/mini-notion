import { statusOptions } from '../data/dummyData'

function PropertyInput({ type = 'text', value, onChange, courses = [], placeholder = '' }) {
  if (type === 'number') {
    return (
      <input
        className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none focus:border-sky-400"
        type="number"
        value={value ?? ''}
        placeholder={placeholder}
        onChange={(event) => onChange(Number(event.target.value))}
      />
    )
  }

  if (type === 'date') {
    return (
      <input
        className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none focus:border-sky-400"
        type="datetime-local"
        value={value ? new Date(value).toISOString().slice(0, 16) : ''}
        onChange={(event) => onChange(event.target.value ? new Date(event.target.value).toISOString() : '')}
      />
    )
  }

  if (type === 'status') {
    return (
      <select
        className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none focus:border-sky-400"
        value={value || 'To Do'}
        onChange={(event) => onChange(event.target.value)}
      >
        {statusOptions.map((status) => (
          <option key={status} value={status}>{status}</option>
        ))}
      </select>
    )
  }

  if (type === 'course') {
    return (
      <select
        className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none focus:border-sky-400"
        value={value || ''}
        onChange={(event) => onChange(event.target.value || null)}
      >
        <option value="">No course</option>
        {courses.map((course) => (
          <option key={course.id} value={course.id}>{course.name}</option>
        ))}
      </select>
    )
  }

  if (type === 'textarea') {
    return (
      <textarea
        className="min-h-28 w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none focus:border-sky-400"
        value={value || ''}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
      />
    )
  }

  if (type === 'color') {
    return (
      <input
        className="h-10 w-full rounded-md border border-slate-700 bg-slate-950 px-2 py-1"
        type="color"
        value={value || '#38bdf8'}
        onChange={(event) => onChange(event.target.value)}
      />
    )
  }

  return (
    <input
      className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none focus:border-sky-400"
      type="text"
      value={Array.isArray(value) ? value.join(', ') : value || ''}
      placeholder={placeholder}
      onChange={(event) => onChange(event.target.value)}
    />
  )
}

export default PropertyInput
