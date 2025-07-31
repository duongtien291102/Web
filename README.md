# Jaika.id.vn - Website Thông Minh

Trang web đơn giản tích hợp AI và database cho tên miền Jaika.id.vn.

## 🚀 Tính năng

- **AI Chat Assistant**: Tương tác với AI từ Google AI Studio
- **Quản lý Database**: Lưu trữ và quản lý dữ liệu
- **Giao diện hiện đại**: Thiết kế responsive và đẹp mắt
- **API Integration**: Tích hợp với Google AI Studio API

## 📋 Yêu cầu hệ thống

- Node.js (version 14 trở lên)
- npm hoặc yarn
- Database server (PostgreSQL, MySQL, hoặc MongoDB)
- Google AI Studio API key

## 🛠️ Cài đặt

### 1. Clone repository
```bash
git clone <repository-url>
cd jaika-website
```

### 2. Cài đặt dependencies
```bash
npm install
```

### 3. Cấu hình môi trường
```bash
# Copy file env.example thành .env
cp env.example .env

# Chỉnh sửa file .env với thông tin thực tế
```

### 4. Cấu hình Database
Chỉnh sửa thông tin database trong file `.env`:
```
DB_HOST=your_database_host
DB_PORT=your_database_port
DB_NAME=your_database_name
DB_USER=your_database_user
DB_PASSWORD=your_database_password
```

### 5. Cấu hình Google AI Studio API
1. Truy cập [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Tạo API key mới
3. Thêm API key vào file `.env`:
```
GOOGLE_AI_API_KEY=your_google_ai_api_key_here
```

## 🚀 Chạy ứng dụng

### Development mode
```bash
npm run dev
```

### Production mode
```bash
npm start
```

Truy cập website tại: `http://localhost:3000`

## 📁 Cấu trúc dự án

```
jaika-website/
├── public/
│   ├── index.html      # Trang chủ
│   ├── styles.css      # CSS styles
│   └── script.js       # JavaScript logic
├── server.js           # Express server
├── package.json        # Dependencies
├── env.example         # Environment variables example
└── README.md          # Documentation
```

## 🔧 API Endpoints

### AI Chat
- `POST /api/ai` - Gửi tin nhắn đến AI
- Body: `{ "prompt": "your message" }`

### Database Operations
- `GET /api/data` - Lấy danh sách dữ liệu
- `POST /api/save` - Lưu dữ liệu mới
- Body: `{ "data": { "name": "...", "description": "..." } }`

### Health Check
- `GET /api/health` - Kiểm tra trạng thái server

## 🎨 Tính năng giao diện

- **Responsive Design**: Tương thích với mọi thiết bị
- **Modern UI**: Thiết kế hiện đại với gradient và animations
- **Chat Interface**: Giao diện chat thân thiện với typing indicator
- **Modal Forms**: Form thêm dữ liệu với modal popup
- **Notifications**: Hệ thống thông báo real-time

## 🔒 Bảo mật

- Sử dụng environment variables cho sensitive data
- CORS enabled cho cross-origin requests
- Input validation và sanitization
- Error handling cho API calls

## 🚀 Deployment

### Vercel
1. Kết nối repository với Vercel
2. Thêm environment variables trong Vercel dashboard
3. Deploy tự động

### Heroku
1. Tạo Heroku app
2. Thêm environment variables
3. Deploy với Git

### VPS/Dedicated Server
1. Upload code lên server
2. Cài đặt Node.js và dependencies
3. Sử dụng PM2 để quản lý process
4. Cấu hình nginx reverse proxy

## 🔧 Tùy chỉnh

### Thay đổi domain
Chỉnh sửa trong file `server.js`:
```javascript
console.log(`Domain: Jaika.id.vn`);
```

### Thay đổi database
Chỉnh sửa logic database trong `server.js`:
```javascript
// Thêm logic kết nối database thực tế
const { Pool } = require('pg'); // PostgreSQL
// hoặc
const mysql = require('mysql2'); // MySQL
```

### Thay đổi AI model
Chỉnh sửa endpoint trong `server.js`:
```javascript
const GOOGLE_AI_ENDPOINT = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';
```

## 📞 Hỗ trợ

Nếu gặp vấn đề, vui lòng:
1. Kiểm tra console logs
2. Kiểm tra network tab trong browser
3. Kiểm tra environment variables
4. Tạo issue trên GitHub

## 📄 License

MIT License - Xem file LICENSE để biết thêm chi tiết.

---

**Jaika.id.vn** - Website thông minh với AI và database integration. 