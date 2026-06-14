import { useMemo, useState } from 'react'
import Sidebar from './components/Sidebar'
import CrudModal from './components/CrudModal'
import DashboardView from './views/DashboardView'
import TableView from './views/TableView'
import KanbanView from './views/KanbanView'
import CalendarView from './views/CalendarView'
import GalleryView from './views/GalleryView'
import { createEntity, initialCourses, initialNotes, initialTasks } from './data/dummyData'

const views = {
  dashboard: DashboardView,
  table: TableView,
  kanban: KanbanView,
  calendar: CalendarView,
  gallery: GalleryView,
}

function App() {
  const [activeView, setActiveView] = useState('dashboard')
  const [selectedCourseId, setSelectedCourseId] = useState(null)
  const [tasks, setTasks] = useState(initialTasks)
  const [courses, setCourses] = useState(initialCourses)
  const [notes, setNotes] = useState(initialNotes)
  const [modal, setModal] = useState(null)

  const filteredTasks = useMemo(() => {
    if (!selectedCourseId) return tasks
    return tasks.filter((task) => task.courseId === selectedCourseId)
  }, [selectedCourseId, tasks])

  const selectedCourse = courses.find((course) => course.id === selectedCourseId)
  const ActiveView = views[activeView] || DashboardView

  const setters = {
    tasks: setTasks,
    courses: setCourses,
    notes: setNotes,
  }

  const openCreate = (entity) => setModal({ entity, mode: 'create', item: null })
  const openEdit = (entity, item) => setModal({ entity, mode: 'edit', item })

  const createItem = (entity, values) => {
    setters[entity]((items) => [createEntity(entity, values), ...items])
    setModal(null)
  }

  const updateItem = (entity, id, patch) => {
    setters[entity]((items) => items.map((item) => (item.id === id ? { ...item, ...patch } : item)))
  }

  const deleteItem = (entity, id) => {
    if (!window.confirm('Delete this item?')) return
    if (entity === 'courses') {
      setTasks((items) => items.map((task) => (task.courseId === id ? { ...task, courseId: null } : task)))
      if (selectedCourseId === id) setSelectedCourseId(null)
    }
    setters[entity]((items) => items.filter((item) => item.id !== id))
  }

  const saveModal = (values) => {
    if (modal.mode === 'create') {
      createItem(modal.entity, values)
      return
    }
    updateItem(modal.entity, modal.item.id, values)
    setModal(null)
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <Sidebar
        activeView={activeView}
        courses={courses}
        selectedCourseId={selectedCourseId}
        onNavigate={setActiveView}
        onQuickAdd={openCreate}
        onSelectCourse={(courseId) => {
          setSelectedCourseId(courseId)
          setActiveView('table')
        }}
        onClearCourse={() => setSelectedCourseId(null)}
      />

      <main className="min-h-screen pl-0 lg:pl-72">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-5 sm:px-6 lg:px-8">
          {selectedCourse && (
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-slate-800 bg-slate-900/80 px-4 py-3">
              <div className="flex items-center gap-3">
                <span className="h-3 w-3 rounded-full" style={{ backgroundColor: selectedCourse.color }} />
                <div>
                  <p className="text-sm font-semibold text-slate-100">Filtered by {selectedCourse.name}</p>
                  <p className="text-xs text-slate-400">{filteredTasks.length} linked tasks visible across task views</p>
                </div>
              </div>
              <button
                className="rounded-md border border-slate-700 px-3 py-2 text-sm text-slate-200 hover:border-slate-500 hover:bg-slate-800"
                type="button"
                onClick={() => setSelectedCourseId(null)}
              >
                Clear filter
              </button>
            </div>
          )}

          <ActiveView
            tasks={filteredTasks}
            allTasks={tasks}
            courses={courses}
            notes={notes}
            selectedCourseId={selectedCourseId}
            onAdd={openCreate}
            onEdit={openEdit}
            onUpdate={updateItem}
            onDelete={deleteItem}
          />
        </div>
      </main>

      {modal && (
        <CrudModal
          entity={modal.entity}
          mode={modal.mode}
          item={modal.item}
          courses={courses}
          onClose={() => setModal(null)}
          onSave={saveModal}
        />
      )}
    </div>
  )
}

export default App
