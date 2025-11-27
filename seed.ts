import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { User, Task, Log, Rule, Video } from './models';

const KITCHEN_TASKS = [
  { title: "Kiểm tra nhiệt độ tủ đông/mát", deadline: "09:00", description: "Đảm bảo tủ mát < 5 độ, tủ đông < -18 độ." },
  { title: "Nhập nguyên liệu tươi sống", deadline: "10:00", description: "Kiểm tra chất lượng thịt bò, hải sản." },
  { title: "Sơ chế thịt bò Ba chỉ", deadline: "11:00", description: "Cắt máy 3mm, xếp khay 200g." },
  { title: "Vệ sinh khu vực bếp nướng", deadline: "14:00", description: "Chà vỉ nướng, dọn than cũ." },
  { title: "Chuẩn bị sốt chấm BBQ", deadline: "16:00", description: "Pha 5 lít sốt theo công thức chuẩn." },
];

const SERVICE_TASKS = [
  { title: "Lau dọn bàn ghế, sàn nhà", deadline: "09:30", description: "Dùng cồn lau mặt bàn, hút bụi sàn." },
  { title: "Kiểm tra máy POS, iPad", deadline: "10:00", description: "Đảm bảo pin > 90%, log in hệ thống." },
  { title: "Setup dụng cụ ăn uống", deadline: "10:30", description: "Đũa, thìa, kẹp nướng tại các bàn." },
  { title: "Kiểm tra nhà vệ sinh", deadline: "11:00", description: "Giấy, nước rửa tay, mùi hương." },
  { title: "Họp đầu ca", deadline: "17:00", description: "Nghe phổ biến món mới/CTKM." },
];

export const seedDatabase = async () => {
  try {
    // Clear existing
    await User.deleteMany({});
    await Task.deleteMany({});
    await Log.deleteMany({});
    await Rule.deleteMany({});
    await Video.deleteMany({});

    // Users
    const passwordHash = await bcrypt.hash('123456', 10);
    
    await User.insertMany([
      { name: "Admin Tổng", email: "admin@phobbq.com", passwordHash, role: "admin", jobPosition: "Chủ Quán" },
      { name: "Quản Lý Cửa Hàng", email: "manager@phobbq.com", passwordHash, role: "manager", jobPosition: "Quản Lý" },
      { name: "Đầu Bếp Hùng", email: "kitchen@phobbq.com", passwordHash, role: "kitchen", jobPosition: "Bếp Trưởng" },
      { name: "Phục Vụ Mai", email: "service@phobbq.com", passwordHash, role: "service", jobPosition: "Tổ trưởng bàn" },
    ]);

    console.log("Users seeded (Admin, Manager, Kitchen, Service) - seed.ts:40");

    // Tasks - FIX: Explicitly type array as any[] to prevent TS7034 error
    const allTasks: any[] = [];
    KITCHEN_TASKS.forEach(t => allTasks.push({ ...t, role: 'kitchen', status: 'pending', isCompleted: false }));
    SERVICE_TASKS.forEach(t => allTasks.push({ ...t, role: 'service', status: 'pending', isCompleted: false }));

    await Task.insertMany(allTasks);
    console.log("Tasks seeded - seed.ts:48");

    // Rules
    await Rule.create({
      title: "NỘI QUY CHUNG PHOBBQ",
      content: "1. Đi làm đúng giờ.\n2. Trang phục chỉnh tề, sạch sẽ.\n3. Không sử dụng điện thoại trong giờ làm việc (trừ việc công).\n4. Luôn mỉm cười với khách hàng.\n5. Báo cáo ngay cho quản lý nếu có sự cố.",
      updatedBy: "Admin Tổng"
    });
    console.log("Rules seeded - seed.ts:56");

    // Videos
    await Video.insertMany([
      { title: "Quy trình rửa tay chuẩn", youtubeUrl: "https://www.youtube.com/watch?v=3PMVJQUCm4Q", order: 1 },
      { title: "Kỹ năng phục vụ bàn chuyên nghiệp", youtubeUrl: "https://www.youtube.com/watch?v=HG8b71jGkEk", order: 2 },
      { title: "Cách ướp thịt nướng ngon", youtubeUrl: "https://www.youtube.com/watch?v=kR2tJd1J5E8", order: 3 }
    ]);
    console.log("Videos seeded - seed.ts:64");
  } catch (error) {
    console.error("Seed Error: - seed.ts:66", error);
  }
};