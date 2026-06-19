# Workshop 8 Jam: Mini Notion React.js

Dokumen ini adalah pegangan operasional pemateri. Presentasi utama tetap ada di `../mini-notion-workshop-guide.html`, sedangkan repo ini menjadi referensi hasil akhir.

## Prinsip Workshop

- Peserta mulai dari base project kosong terarah, bukan dari nol.
- Setup Vite, Tailwind, dummy data, constants, dan dependency sudah disiapkan.
- Live coding fokus ke React dasar: `useState`, props, event handler, `.map()`, `.filter()`, `.sort()`, dan conditional render.
- App final boleh punya i18n dan calendar grid penuh, tapi itu tidak wajib diajarkan ke beginner.
- Nama file navigasi yang dipakai adalah `Navbar.jsx`, bukan `Sidebar.jsx`.

## Rundown

| Waktu | Sesi | Fokus | Acceptance |
| --- | --- | --- | --- |
| 08.00-08.30 | Setup & Orientasi | Clone repo base, `npm install`, `npm run dev`, struktur folder | Semua peserta melihat halaman placeholder |
| 08.30-09.30 | Modul 1: Engine | State utama, form state, CRUD, `FormView.jsx` | Task dan course bisa create, edit, delete |
| 09.30-10.30 | Modul 2: Views | `Navbar.jsx`, `TableView.jsx`, `KanbanView.jsx` | Nav jalan, drag task mengubah status |
| 10.30-10.45 | Break + Recovery | Bantu peserta tertinggal, pindah ke checkpoint bila perlu | Mayoritas siap lanjut |
| 10.45-11.45 | Modul 3: Relation & Logic | `selectedCourseId`, `filteredTasks`, course lookup, filter/sort | Task terhubung ke course dan bisa difilter |
| 11.45-12.30 | Modul 4: Dashboard | Daily Summary, Urgent Alert, Progress Tracker | Dashboard update saat data berubah |
| 12.30-13.00 | Istirahat Siang | - | - |
| 13.00-14.00 | Modul 5: Calendar & Gallery | Gallery notes, Calendar deadline list minimum | Semua view utama aktif |
| 14.00-15.15 | Polish & Portfolio | Empty state, responsive check, build, deploy prep | App siap demo |
| 15.15-16.00 | Demo & Penutup | Demo 2-3 menit per peserta, next steps | Peserta bisa menjelaskan 1 konsep React |

## Build Order

1. `App.jsx`
   - Tambahkan `activeView`, `tableEntity`, `selectedCourseId`, `tasks`, `courses`, `notes`, dan `formState`.
   - Buat handler eksplisit: `showCreateForm`, `showEditForm`, `closeForm`, `addTask`, `addCourse`, `addNote`, `updateTask`, `updateCourse`, `updateNote`, `deleteTask`, `deleteCourse`, `deleteNote`, `saveForm`.
   - Buat `renderView()` agar peserta paham active view menentukan komponen yang tampil.

2. `views/FormView.jsx`
   - Mulai dari task form: title, status, deadline, course.
   - Tambahkan course form dan note form bila task form sudah stabil.
   - Gunakan satu objek `formData`, bukan abstraksi input generik.

3. `components/Navbar.jsx`
   - Render `NAV_ITEMS`.
   - Tombol nav cukup memanggil `setActiveView`.
   - Quick add boleh ditambahkan setelah peserta paham create flow.

4. `views/TableView.jsx`
   - Ajarkan `.map()` dari array ke baris tabel.
   - Entity switcher untuk `tasks`, `courses`, dan `notes`.
   - Tombol edit/delete memanggil handler dari `App.jsx`.

5. `views/KanbanView.jsx`
   - Buat 3 kolom status terlebih dahulu.
   - Tambahkan `@dnd-kit` setelah peserta paham filter per kolom.
   - Gunakan drag handle yang terlihat agar peserta tahu kartu bisa digeser.

6. Relation & Dashboard
   - Tambahkan `filteredTasks` dari `selectedCourseId`.
   - Tampilkan course name/color pada task.
   - Dashboard menghitung derived values dari props, bukan menyimpan data sendiri.

7. `views/GalleryView.jsx` dan `views/CalendarView.jsx`
   - Gallery: card grid untuk notes.
   - Calendar minimum: daftar task yang punya deadline.
   - Calendar grid penuh hanya bonus jika waktu longgar.

## Fallback Saat Waktu Mepet

- Modul 1 harus selesai. Jika tidak, pindah ke checkpoint CRUD.
- Modul 2 minimal harus punya Table dan Kanban tanpa reorder internal.
- Modul 3 cukup relation + urgent sort, filter UI bisa disederhanakan.
- Modul 4 progress tracker boleh tampil teks dulu tanpa bar.
- Modul 5 Calendar cukup deadline list, tidak perlu grid bulanan.
- Deploy boleh diganti dengan `npm run build` dan screenshot app jika akun GitHub/Vercel peserta belum siap.

## Manual QA

- Tambah, edit, hapus task.
- Tambah course, hubungkan task ke course.
- Pindah Dashboard, Table, Kanban, Calendar, Gallery.
- Drag task antar kolom Kanban.
- Ubah task menjadi `Done`, progress dashboard ikut berubah.
- Buat deadline kurang dari 24 jam, task muncul di Urgent Alert.
- Hapus semua item di salah satu list, empty state tetap rapi.
