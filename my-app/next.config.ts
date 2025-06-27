// my-app/next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true, // Giữ lại nếu bạn muốn (khuyến nghị cho dev)
  
  // Đặt allowedDevOrigins trực tiếp ở đây
  allowedDevOrigins: [
    "http://localhost:3000",     // Luôn cho phép localhost
    "http://192.168.1.183:3000", // IP mạng mà Next.js đang chạy (hoặc cổng mà nó tự chọn, ví dụ 3001)
    // Thêm các cổng khác nếu Next.js tự động chọn (ví dụ khi 3000 bận)
    "http://localhost:3001",
    "http://192.168.1.183:3001",
  ],

  // Cấu hình QUAN TRỌNG để proxy API requests đến backend
  async rewrites() {
    return [
      {
        source: '/api/:path*', // Mọi yêu cầu từ frontend bắt đầu bằng /api/
        destination: 'http://localhost:5000/api/:path*', // Sẽ được chuyển hướng đến backend trên port 5000
      },
    ];
  },

  // Các config options khác của bạn có thể ở đây
};

export default nextConfig;