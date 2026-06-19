# Checkpoint Guide

Checkpoint dipakai sebagai fallback saat peserta tertinggal. Simpan checkpoint sebagai branch Git, folder zip, atau commit tag. Pilih satu metode sebelum hari H agar pemateri dan asisten tidak bingung.

## Recommended Branch Names

| Checkpoint | Isi Minimal | Dipakai Setelah |
| --- | --- | --- |
| `checkpoint-0-base` | Vite, Tailwind, dummy data, constants, placeholder UI | Setup |
| `checkpoint-1-crud` | `App.jsx` state + CRUD, `FormView.jsx` | Modul 1 |
| `checkpoint-2-views` | `Navbar.jsx`, `TableView.jsx`, `KanbanView.jsx` | Modul 2 |
| `checkpoint-3-logic` | Relation, `selectedCourseId`, `filteredTasks`, urgent sort | Modul 3 |
| `checkpoint-4-dashboard` | `DashboardView.jsx` dengan summary, alert, progress | Modul 4 |
| `checkpoint-5-final` | Gallery, Calendar minimum, polish, build-ready | Modul 5 |

## Base Project Contract

Base project harus sudah punya:

- `package.json` dengan React, Vite, Tailwind, dan `@dnd-kit`.
- `src/main.jsx` tidak perlu disentuh peserta.
- `src/index.css` sudah import Tailwind.
- `src/data/dummyData.js` berisi `initialTasks`, `initialCourses`, `initialNotes`.
- `src/constants/index.js` berisi `NAV_ITEMS`, `STATUS_OPTIONS`, dan `TAG_PALETTE`.
- `src/components/` dan `src/views/` boleh kosong atau hanya berisi `.gitkeep`.
- `src/App.jsx` menampilkan placeholder yang jelas, bukan blank white screen.

## Checkpoint Creation Flow

Gunakan flow ini saat menyiapkan repo latihan:

```bash
git switch -c checkpoint-0-base
git add -A
git commit -m "checkpoint 0 base"

git switch -c checkpoint-1-crud
# implement sampai CRUD selesai
git add -A
git commit -m "checkpoint 1 crud"

git switch -c checkpoint-2-views
# implement sampai Navbar, Table, Kanban selesai
git add -A
git commit -m "checkpoint 2 views"
```

Lanjutkan pola yang sama sampai `checkpoint-5-final`.

## Recovery Script Saat Kelas

Jika peserta tertinggal jauh:

```bash
git fetch --all
git switch checkpoint-2-views
npm install
npm run dev
```

Jika peserta punya perubahan lokal yang masih ingin disimpan:

```bash
git status
git stash push -m "workshop progress sebelum pindah checkpoint"
git switch checkpoint-2-views
```

## Acceptance Per Checkpoint

- `checkpoint-0-base`: browser menampilkan placeholder dan tidak ada error startup.
- `checkpoint-1-crud`: form bisa simpan task dan course.
- `checkpoint-2-views`: nav, table, dan kanban tampil; drag antar kolom jalan.
- `checkpoint-3-logic`: filter course dan urgent deadline logic jalan.
- `checkpoint-4-dashboard`: progress dan urgent alert update dari state.
- `checkpoint-5-final`: `npm run build` berhasil dan semua view bisa dibuka.
