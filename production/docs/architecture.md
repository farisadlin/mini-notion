# Arsitektur Mini Notion

Dokumen ini menjelaskan bentuk data dan alur aplikasi Mini Notion saat ini. Diagram dibuat untuk membantu membaca kode, bukan sebagai rancangan database yang harus diimplementasikan.

## ERD: Relasi Data

Versi yang dapat diedit tersedia dalam format [`mini-notion.dbml`](mini-notion.dbml). Untuk membukanya di DB Diagram:

1. Buka [dbdiagram.io](https://dbdiagram.io).
2. Buat diagram baru.
3. Salin isi `mini-notion.dbml` ke editor atau gunakan menu **Import DBML**.

File DBML menggunakan bentuk tabel relasional agar relasi mudah divisualisasikan. Bentuk ini tetap konseptual karena aplikasi saat ini menyimpan data sebagai object dan array di React state.

### Preview ERD

```mermaid
erDiagram
    COURSE o|--o{ TASK : "dipilih oleh"
    NOTE ||--o{ TAG : "menyimpan"

    COURSE {
        string id PK
        string name
        number credits
        string color
        string schedule
        string location
    }

    TASK {
        string id PK
        string title
        string status
        datetime deadline
        string courseId FK "opsional, boleh null"
        datetime createdAt
    }

    NOTE {
        string id PK
        string title
        string content
        TagArray tags "object tertanam"
        datetime createdAt
    }

    TAG {
        string name
        string color
    }
```

### Cara membaca ERD

- Satu `Course` dapat memiliki nol atau banyak `Task`.
- Satu `Task` dapat terhubung ke nol atau satu `Course` melalui `courseId`. Nilai `null` berarti task tidak terikat ke mata kuliah mana pun.
- Saat sebuah course dihapus, task yang sebelumnya terhubung tidak ikut dihapus. Aplikasi mengubah `courseId` task tersebut menjadi `null`.
- Satu `Note` dapat menyimpan nol atau banyak `Tag`.
- `Tag` ditampilkan sebagai entity konseptual agar strukturnya mudah dipahami. Di dalam kode, tag bukan collection state terpisah, tetapi object `{ name, color }` di dalam array `note.tags`.

## Flow Aplikasi

Versi editable tersedia di [`mini-notion-flow.excalidraw`](mini-notion-flow.excalidraw). Buka [excalidraw.com](https://excalidraw.com), pilih **Open**, lalu pilih file tersebut.

Untuk Mermaid Live Editor, salin hanya isi di dalam blok diagram tanpa baris pembuka dan penutup tiga backtick.

### 1. Startup, navigasi, dan pemilihan view

```mermaid
flowchart LR
    subgraph Startup["1. Startup"]
        Main["main.jsx"] -->|"mount React"| App["App.jsx"]
        Dummy["dummyData.js"] -->|"data awal"| App
    end

    subgraph Navigation["2. Navigasi"]
        Navbar["Navbar"] -->|"onNavigate(view)"| ActiveView["activeView"]
        ActiveView --> RenderView["renderView()"]
    end

    subgraph Views["3. View aktif"]
        Dashboard["Dashboard"]
        Table["Table"]
        Kanban["Kanban"]
        Calendar["Calendar"]
        Gallery["Gallery"]
        Form["Form"]
    end

    App --> Navbar
    App --> ActiveView
    RenderView --> Dashboard
    RenderView --> Table
    RenderView --> Kanban
    RenderView --> Calendar
    RenderView --> Gallery
    RenderView --> Form
```

### 2. Aksi pengguna dan perubahan data

```mermaid
flowchart LR
    subgraph Actions["1. Aksi pengguna"]
        AddEdit["Add atau Edit"]
        DeleteAction["Delete"]
        Drag["Drag task di Kanban"]
    end

    subgraph Handlers["2. Callback di App.jsx"]
        OpenForm["showCreateForm()<br/>showEditForm()"]
        FormView["FormView"]
        SaveForm["saveForm()"]
        DeleteItem["deleteItem()"]
        DropResult{"Tujuan drag?"}
        Reorder["reorderTask()"]
        UpdateStatus["updateItem()"]
    end

    subgraph State["3. React state"]
        Collections["tasks<br/>courses<br/>notes"]
        CourseId["selectedCourseId"]
        Filter["filteredTasks"]
    end

    subgraph Output["4. Hasil"]
        Render["React render ulang"]
        TaskViews["Dashboard<br/>Table<br/>Kanban<br/>Calendar"]
        GalleryView["Gallery"]
    end

    AddEdit --> OpenForm --> FormView --> SaveForm --> Collections
    DeleteAction -->|"setelah konfirmasi"| DeleteItem --> Collections
    Drag --> DropResult
    DropResult -->|"posisi baru"| Reorder --> Collections
    DropResult -->|"status baru"| UpdateStatus --> Collections

    Collections --> Render
    Render --> GalleryView
    Collections -->|"tasks"| Filter
    CourseId --> Filter
    Filter --> TaskViews
```

### Cara membaca flow

1. `main.jsx` memasang komponen `App` ke halaman.
2. `App.jsx` membuat state awal dari data di `dummyData.js`. State utama terdiri dari `tasks`, `courses`, `notes`, view aktif, filter course, dan kondisi form.
3. Navbar mengubah `activeView`. Fungsi `renderView()` kemudian memilih view yang ditampilkan.
4. Data dikirim dari `App` ke view melalui props. View tidak menyimpan collection utama sendiri.
5. Saat pengguna menambah, mengedit, menghapus, atau memindahkan task, view memanggil callback dari `App`.
6. Callback memperbarui state React. Perubahan state memicu render ulang sehingga view menampilkan data terbaru.
7. Dropdown filter mata kuliah mengubah `selectedCourseId`. Jika nilainya berisi ID course, `filteredTasks` hanya memuat task milik course tersebut; nilai kosong menampilkan semua task. Hasil filter yang sama dikirim ke Dasbor, Tabel Tugas, Kanban, dan Kalender.

## Penyimpanan Data

Mini Notion belum memakai database, API, atau `localStorage`. Semua perubahan hanya hidup di React state selama tab aplikasi masih terbuka.

Saat halaman dimuat ulang:

1. React state dibuat ulang.
2. `initialTasks`, `initialCourses`, dan `initialNotes` dari `dummyData.js` dipakai kembali.
3. Data yang ditambah, diedit, dihapus, atau diurutkan selama sesi sebelumnya akan hilang.

Alur singkatnya adalah:

```text
dummyData.js -> React state di App.jsx -> props ke view -> callback ke App.jsx -> state baru -> render ulang
```
