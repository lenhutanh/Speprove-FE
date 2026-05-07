# Speprove-FE - Project Overview

Đây là tài liệu tổng quan về dự án frontend **Speprove-FE**, được xây dựng dựa trên Next.js và hệ sinh thái React hiện đại.

## 🛠 Tech Stack (Công nghệ sử dụng)

Dự án sử dụng các công nghệ mới nhất trong hệ sinh thái frontend:

- **Framework:** Next.js 16.1.1 (App Router)
- **Library:** React 19.2.3 & React DOM 19.2.3
- **Styling:** Tailwind CSS v4, `clsx`, `tailwind-merge`
- **UI Components:**
  - Radix UI (Primitives cho các component tĩnh)
  - Base UI
  - Framer Motion & `tw-animate-css` (Animations)
- **State Management:**
  - Zustand (Global state)
  - TanStack React Query v5 (Data fetching & Server state)
- **Form & Validation:** React Hook Form kết hợp với Zod
- **Khác:**
  - `lucide-react` (Icons)
  - `date-fns`, `react-day-picker` (Xử lý thời gian)
  - `sonner` (Toast notifications)
  - `recordrtc` (Ghi âm/video)

## 📁 Cấu trúc thư mục (Project Structure)

Dự án được tổ chức theo chuẩn Next.js App Router kết hợp với cấu trúc module hóa:

```text
speprove-fe/
├── public/                 # Các tài nguyên tĩnh (images, fonts,...)
├── src/                    # Mã nguồn chính của ứng dụng
│   ├── api-requests/       # Các hàm gọi API (Axios/Fetch)
│   ├── app/                # Next.js App Router (Chứa các page và layout)
│   │   ├── (auth)/         # Nhóm route xác thực (Login, Register,...)
│   │   ├── (home)/         # Nhóm route trang chủ
│   │   ├── forecast/       # Route dự đoán/Forecast
│   │   ├── mock-test/      # Route thi thử (Mock Test)
│   │   ├── payment/        # Route thanh toán
│   │   ├── globals.css     # CSS toàn cục
│   │   └── layout.tsx      # Root Layout
│   ├── assets/             # Hình ảnh, icons, CSS được import vào code
│   ├── components/         # Các UI components dùng chung (Button, Input,...)
│   ├── constants/          # Các biến hằng số, cấu hình tĩnh
│   ├── hooks/              # Custom React Hooks
│   ├── lib/                # Thư viện tiện ích bên thứ 3 cấu hình sẵn
│   ├── logger/             # Cấu hình logging
│   ├── queries/            # React Query hooks (useQuery, useMutation)
│   ├── routes/             # Định nghĩa đường dẫn các route trong app
│   ├── store/              # Zustand stores (Global states)
│   ├── types/              # TypeScript interfaces và types
│   ├── utils/              # Các hàm helper functions
│   ├── validations/        # Zod schemas để validate data (Form)
│   ├── envConfig.ts        # File cấu hình và validate biến môi trường
│   └── proxy.ts            # Cấu hình proxy (nếu có)
├── .husky/                 # Git hooks (pre-commit, pre-push)
├── .env, .env.example      # Biến môi trường
├── package.json            # Quản lý dependencies và scripts
├── next.config.ts          # Cấu hình Next.js
└── eslint.config.mjs       # Cấu hình ESLint
```

## 📜 Scripts chính trong `package.json`

- `pnpm dev`: Chạy server phát triển ở cổng 3000 (sử dụng Turbopack).
- `pnpm build`: Build dự án cho môi trường production.
- `pnpm start`: Chạy server production sau khi build.
- `pnpm lint`: Kiểm tra lỗi code bằng ESLint.
- `pnpm format`: Định dạng lại code bằng Prettier.
- `pnpm type-check`: Kiểm tra lỗi TypeScript mà không build.

## 💡 Luồng hoạt động cơ bản

1. **Routing:** Người dùng truy cập các đường dẫn được định nghĩa trong `src/app`.
2. **Data Fetching:** Component gọi các hook từ `src/queries` (sử dụng React Query), hook này sẽ gọi các hàm từ `src/api-requests` để lấy dữ liệu từ API server.
3. **State Management:** Dữ liệu UI cục bộ hoặc global (như User info) được quản lý qua `Zustand` (trong `src/store`).
4. **Validation:** Các form gửi đi được kiểm tra tính hợp lệ bằng `Zod` (trong `src/validations`) trước khi gọi API.
