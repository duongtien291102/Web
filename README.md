# NotepadOnline

Ứng dụng ghi chú online tương tự anotepad.com

## Chức năng

✅ Đăng ký / Đăng nhập
✅ Tạo, sửa, xóa ghi chú
✅ Share link ghi chú
✅ Lưu tạm thời ở frontend (localStorage)
✅ Kết nối MongoDB

## Cài đặt

```bash
npm install
```

## Cấu hình

Tạo file `.env` từ `.env.example` và điền thông tin:

```
MONGO_URI=mongodb+srv://...
JWT_SECRET=your_secret_key
PORT=3000
```

## Chạy local

```bash
npm start
```

## Deploy lên Vercel

1. Cài Vercel CLI: `npm i -g vercel`
2. Login: `vercel login`
3. Deploy: `vercel`
4. Thêm biến môi trường trên Vercel Dashboard:
   - MONGO_URI
   - JWT_SECRET
   - PORT (optional)

Hoặc deploy qua Vercel Dashboard:
1. Import project từ GitHub
2. Thêm Environment Variables
3. Deploy
