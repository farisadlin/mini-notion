import { addMonths, eachDayOfInterval, endOfMonth, endOfWeek, format, isSameDay, isSameMonth, startOfMonth, startOfWeek, subMonths } from 'date-fns'
import { useMemo, useState } from 'react'

function CalendarView({ tasks, courses, onEdit }) {
  const [month, setMonth] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState(new Date())

  const days = useMemo(() => {
    const start = startOfWeek(startOfMonth(month))
    const end = endOfWeek(endOfMonth(month))
    return eachDayOfInterval({ start, end })
  }, [month])

  const selectedTasks = tasks.filter((task) => task.deadline && isSameDay(new Date(task.deadline), selectedDate))

  return (
    <section className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-semibold text-slate-50">Calendar</h2>
          <p className="text-sm text-slate-400">Monthly deadline view for active tasks.</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="rounded-md border border-slate-700 px-3 py-2 text-sm hover:bg-slate-800" type="button" onClick={() => setMonth(subMonths(month, 1))}>Prev</button>
          <span className="min-w-36 text-center font-semibold text-slate-100">{format(month, 'MMMM yyyy')}</span>
          <button className="rounded-md border border-slate-700 px-3 py-2 text-sm hover:bg-slate-800" type="button" onClick={() => setMonth(addMonths(month, 1))}>Next</button>
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-[1fr_320px]">
        <div className="overflow-hidden rounded-lg border border-slate-800 bg-slate-900/70">
          <div className="grid grid-cols-7 border-b border-slate-800 text-center text-xs font-semibold uppercase tracking-wide text-slate-500">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => <div className="px-2 py-3" key={day}>{day}</div>)}
          </div>
          <div className="grid grid-cols-7">
            {days.map((day) => {
              const dayTasks = tasks.filter((task) => task.deadline && isSameDay(new Date(task.deadline), day))
              return (
                <button
                  className={`min-h-24 border-b border-r border-slate-800 p-2 text-left transition hover:bg-slate-800/70 ${isSameMonth(day, month) ? 'bg-slate-900/40' : 'bg-slate-950/70 text-slate-600'} ${isSameDay(day, selectedDate) ? 'ring-1 ring-inset ring-sky-400' : ''}`}
                  key={day.toISOString()}
                  type="button"
                  onClick={() => setSelectedDate(day)}
                >
                  <span className="text-sm font-medium">{format(day, 'd')}</span>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {dayTasks.slice(0, 4).map((task) => {
                      const course = courses.find((item) => item.id === task.courseId)
                      return <span className="h-2 w-2 rounded-full bg-sky-400" key={task.id} style={{ backgroundColor: course?.color || '#38bdf8' }} />
                    })}
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        <aside className="rounded-lg border border-slate-800 bg-slate-900/70 p-4">
          <h3 className="font-semibold text-slate-100">{format(selectedDate, 'EEEE, MMM d')}</h3>
          <div className="mt-4 space-y-3">
            {selectedTasks.length ? selectedTasks.map((task) => {
              const course = courses.find((item) => item.id === task.courseId)
              return (
                <button className="w-full rounded-md border border-slate-800 bg-slate-950 p-3 text-left hover:border-slate-600" key={task.id} type="button" onClick={() => onEdit('tasks', task)}>
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: course?.color || '#64748b' }} />
                    <p className="font-medium text-slate-100">{task.title}</p>
                  </div>
                  <p className="mt-1 text-xs text-slate-500">{task.status}</p>
                </button>
              )
            }) : <p className="text-sm text-slate-400">No tasks for this date.</p>}
          </div>
        </aside>
      </div>
    </section>
  )
}

export default CalendarView
