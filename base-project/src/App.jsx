import Navbar from "./components/Navbar";
import { useTranslation } from "react-i18next";

// GUIDES:
// 6 views: dashboard, table, kanban, calendar, gallery, form -> default-nya "dashboard"
// 3 tableEntity: tasks, courses, notes -> default-nya "tasks"

// TODOS:
// 1. Buat folder views -> TableViews, DashboardViews, KanbanViews
// 2. Fokus TableViews -> Tasks: Tugas, Courses: Mata Kuliah, Notes: Catatan
// 3. Ambil nilai awal dari dummyData yang sudah tersedia: initialCourses, initialTasks, initialNotes
// 4. Buat useState untuk tasks, courses, notes menggunakan nilai dari tahapan 3 sebelumnya
// 5. Buat useState untuk activeView: TableView, DashboardView, KanbanView
// 6. Buat useState untuk formState dengan object: entity, mode ("create", "edit"), item, previousView (list views)
// 7. Buat function showCreateForm dengan parameter entity
// 8. Masukkan props activeView, setActiveView, showCreateForm ke dalam Navbar
// 9. Masuk ke FormViews
// 10. Buat function renderViews -> FormView
// 11. Masukkan props entity, mode, item, courses -> Checkpoint dulu bisa diklik apa enggak
// 12. Buat function untuk addTask (values), saveForm (entity, values), closeForm -> panggil createTask dari dummyData
// 13. Balik ke FormViews
// 14. Masukkan data di Tasks sambil membuat console logs formState untuk melihat datanya masuk apa enggak
// 15. Buat function untuk updateTask (id, values) -> buat function updateItem (entity, id, values)
// 16. Tambahkan updateItem di dalam saveForm
// 17. Ubah TableView
// 18. Panggil TableView ke renderViews() -> Masukkan showEditForm -> buat function deleteItem -> Masukkan semua props di TableView
// 19. Tambahkan deleteTask (id) -> buat function deleteItem (entity, id)
// 20. Lakukan hal yang sama untuk courses dan notes. Lengkapi semua

export default function App() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <Navbar />
      <main>
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-5 sm:px-6 lg:px-8">
          {/* {renderViews()}*/}
        </div>
      </main>
    </div>
  );
}
