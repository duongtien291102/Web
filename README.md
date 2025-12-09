# 📝 NotepadOnline - Anotepad Clone

Ứng dụng ghi chú online đầy đủ tính năng, tương tự anotepad.com

## ✨ Tính năng

### Ghi chú cơ bản
- ✅ **Plain Text** - Văn bản thuần túy
- ✅ **Rich Text** - Soạn thảo với định dạng (Quill Editor)
- ✅ **Task List** - Danh sách công việc với checkbox
- ✅ Tự động lưu nháp (localStorage)
- ✅ Không cần đăng nhập để sử dụng

### Quản lý & Lưu trữ
- ✅ Đăng ký / Đăng nhập
- ✅ Quản lý danh sách ghi chú
- ✅ Khách: Tối đa 10 ghi chú (theo guest token)
- ✅ Người dùng: Không giới hạn

### Chia sẻ & Bảo mật
- ✅ Share link công khai
- ✅ Bảo vệ bằng mật khẩu xem
- ✅ Mật khẩu chỉnh sửa (cho phép người khác edit)
- ✅ Ghi chú công khai/riêng tư

### Xuất file
- ✅ Tải xuống Plain Text (.txt)
- ✅ Tải xuống Rich Text (.html)
- ✅ Tải xuống Task List

## 🚀 Cài đặt

```bash
npm install
```

## ⚙️ Cấu hình

Tạo file `.env`:

```env
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/notepad?retryWrites=true&w=majority
JWT_SECRET=your_secret_key_here
PORT=3000
```

## 💻 Chạy local

```bash
npm start
```

Truy cập: http://localhost:3000

## 🌐 Deploy lên Vercel

### Cách 1: Vercel Dashboard (Khuyến nghị)
1. Push code lên GitHub
2. Vào https://vercel.com → New Project
3. Import repository
4. Thêm Environment Variables:
   - `MONGO_URI`
   - `JWT_SECRET`
5. Deploy

### Cách 2: Vercel CLI
```bash
npm i -g vercel
vercel login
vercel
```

## 📋 MongoDB Atlas Setup

1. Tạo cluster tại https://cloud.mongodb.com
2. Database Access → Add User (username/password)
3. Network Access → Add IP: `0.0.0.0/0` (Allow all)
4. Connect → Get connection string
5. Thay `<password>` và thêm database name `/notepad`

## 🎯 Sử dụng

### Chế độ Khách
- Tự động nhận guest token
- Tạo tối đa 10 ghi chú
- Share link công khai
- Dữ liệu lưu trên server

### Chế độ Đăng nhập
- Không giới hạn ghi chú
- Quản lý danh sách
- Bảo vệ bằng mật khẩu
- Ghi chú riêng tư

## 🛠️ Tech Stack

- **Backend**: Node.js, Express, MongoDB, Mongoose
- **Frontend**: Vanilla JS, Quill.js (Rich Text Editor)
- **Auth**: JWT
- **Deploy**: Vercel

## 📝 API Endpoints

```
POST   /api/auth/register          - Đăng ký
POST   /api/auth/login             - Đăng nhập
GET    /api/guest/token            - Lấy guest token
GET    /api/notes                  - Danh sách ghi chú
POST   /api/notes                  - Tạo ghi chú mới
PUT    /api/notes/:id              - Cập nhật ghi chú
DELETE /api/notes/:id              - Xóa ghi chú
GET    /api/notes/share/:shareId   - Xem ghi chú share
POST   /api/notes/share/:shareId/verify - Xác thực mật khẩu
PUT    /api/notes/share/:shareId   - Chỉnh sửa ghi chú share
```

## 📄 License

MIT
