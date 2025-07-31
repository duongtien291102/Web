# 🚀 Hướng dẫn nhanh - Jaika.id.vn

## Bước 1: Cài đặt
```bash
npm install
```

## Bước 2: Cấu hình
1. Copy file `env.example` thành `.env`
2. Chỉnh sửa thông tin trong file `.env`:
   - Thêm Google AI Studio API key
   - Cấu hình database (nếu có)

## Bước 3: Chạy ứng dụng
```bash
npm start
```

## Bước 4: Truy cập
Mở trình duyệt và truy cập: `http://localhost:3000`

## 🎯 Tính năng chính

### 1. AI Chat
- Tương tác với AI từ Google AI Studio
- Giao diện chat thân thiện
- Typing indicator khi AI đang xử lý

### 2. Quản lý Database
- Xem danh sách dữ liệu
- Thêm dữ liệu mới qua modal form
- Giao diện quản lý trực quan

### 3. Giao diện hiện đại
- Responsive design
- Animations mượt mà
- Gradient backgrounds đẹp mắt

## 🔧 Cấu hình quan trọng

### Google AI Studio API
1. Truy cập: https://makersuite.google.com/app/apikey
2. Tạo API key mới
3. Thêm vào file `.env`:
```
GOOGLE_AI_API_KEY=your_api_key_here
```

### Database (tùy chọn)
Nếu bạn có database, cấu hình trong `.env`:
```
DB_HOST=your_host
DB_PORT=your_port
DB_NAME=your_database
DB_USER=your_user
DB_PASSWORD=your_password
```

## 🚀 Deployment

### Vercel (Khuyến nghị)
1. Push code lên GitHub
2. Kết nối với Vercel
3. Thêm environment variables
4. Deploy tự động

### Heroku
1. Tạo Heroku app
2. Thêm environment variables
3. Deploy với Git

## 📞 Hỗ trợ
- Kiểm tra console logs nếu có lỗi
- Đảm bảo API key đã được cấu hình đúng
- Kiểm tra kết nối database (nếu sử dụng)

---
**Jaika.id.vn** - Website thông minh với AI và database integration. 