import { addMonths, eachDayOfInterval, endOfMonth, endOfWeek, format, isSameDay, isSameMonth, startOfMonth, startOfWeek, subMonths } from 'date-fns'
import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

function CalendarView({ tasks, courses, onEdit }) {
  const { t, i18n } = useTranslation()
  const [month, setMonth] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState(new Date())
  const locale = i18n.language === 'id' ? 'id-ID' : 'en-US'

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
          <h2 className="text-2xl font-semibold text-slate-50">{t('calendar.title')}</h2>
          <p className="text-sm text-slate-400">{t('calendar.subtitle')}</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="rounded-md border border-slate-700 px-3 py-2 text-sm hover:bg-slate-800" type="button" onClick={() => setMonth(subMonths(month, 1))}>{t('calendar.prev')}</button>
          <span className="min-w-36 text-center font-semibold text-slate-100">{month.toLocaleDateString(locale, { month: 'long', year: 'numeric' })}</span>
          <button className="rounded-md border border-slate-700 px-3 py-2 text-sm hover:bg-slate-800" type="button" onClick={() => setMonth(addMonths(month, 1))}>{t('calendar.next')}</button>
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-[1fr_320px]">
        <div className="overflow-hidden rounded-lg border border-slate-800 bg-slate-900/70">
          <div className="grid grid-cols-7 border-b border-slate-800 text-center text-xs font-semibold uppercase tracking-wide text-slate-500">
            {Array.from({ length: 7 }, (_, index) => {
              const day = new Date(2026, 0, 4 + index)
              return <div className="px-2 py-3" key={day.toISOString()}>{day.toLocaleDateString(locale, { weekday: 'short' })}</div>
            })}
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
          <h3 className="font-semibold text-slate-100">{selectedDate.toLocaleDateString(locale, { weekday: 'long', month: 'short', day: 'numeric' })}</h3>
          <div className="mt-4 space-y-3">
            {selectedTasks.length ? selectedTasks.map((task) => {
              const course = courses.find((item) => item.id === task.courseId)
              return (
                <button className="w-full rounded-md border border-slate-800 bg-slate-950 p-3 text-left hover:border-slate-600" key={task.id} type="button" onClick={() => onEdit('tasks', task)}>
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: course?.color || '#64748b' }} />
                    <p className="font-medium text-slate-100">{task.title}</p>
                  </div>
                  <p className="mt-1 text-xs text-slate-500">{t(task.status === 'To Do' ? 'status.todo' : task.status === 'In Progress' ? 'status.inProgress' : 'status.done')}</p>
                </button>
              )
            }) : <p className="text-sm text-slate-400">{t('calendar.noTasks')}</p>}
          </div>
        </aside>
      </div>
    </section>
  )
}

export default CalendarView
