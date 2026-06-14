import { useState } from 'react'

function GalleryView({ notes, onAdd, onEdit, onDelete }) {
  const [activeNote, setActiveNote] = useState(null)

  return (
    <section className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-semibold text-slate-50">Gallery</h2>
          <p className="text-sm text-slate-400">Notes as compact cards with tags.</p>
        </div>
        <button className="rounded-md bg-violet-400 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-violet-300" type="button" onClick={() => onAdd('notes')}>Add note</button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {notes.map((note) => (
          <article className="rounded-lg border border-slate-800 bg-slate-900/70 p-4 transition hover:border-slate-600" key={note.id}>
            <button className="w-full text-left" type="button" onClick={() => setActiveNote(note)}>
              <h3 className="font-semibold text-slate-100">{note.title}</h3>
              <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-400">{note.content}</p>
            </button>
            <div className="mt-4 flex flex-wrap gap-2">
              {note.tags.map((tag) => (
                <span className="rounded-full bg-slate-800 px-2.5 py-1 text-xs text-sky-200" key={tag}>{tag}</span>
              ))}
            </div>
            <div className="mt-4 flex gap-2">
              <button className="rounded-md border border-slate-700 px-2 py-1 text-xs text-slate-200 hover:bg-slate-800" type="button" onClick={() => onEdit('notes', note)}>Edit</button>
              <button className="rounded-md border border-red-500/50 px-2 py-1 text-xs text-red-200 hover:bg-red-500/10" type="button" onClick={() => onDelete('notes', note.id)}>Delete</button>
            </div>
          </article>
        ))}
      </div>

      {activeNote && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 px-4 backdrop-blur-sm">
          <article className="w-full max-w-2xl rounded-lg border border-slate-700 bg-slate-900 p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-xl font-semibold text-slate-50">{activeNote.title}</h3>
                <p className="mt-1 text-xs text-slate-500">{new Date(activeNote.createdAt).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}</p>
              </div>
              <button className="rounded-md px-2 py-1 text-slate-400 hover:bg-slate-800 hover:text-slate-100" type="button" onClick={() => setActiveNote(null)}>Close</button>
            </div>
            <p className="mt-5 whitespace-pre-wrap leading-7 text-slate-300">{activeNote.content}</p>
            <div className="mt-5 flex flex-wrap gap-2">
              {activeNote.tags.map((tag) => <span className="rounded-full bg-slate-800 px-2.5 py-1 text-xs text-sky-200" key={tag}>{tag}</span>)}
            </div>
          </article>
        </div>
      )}
    </section>
  )
}

export default GalleryView
