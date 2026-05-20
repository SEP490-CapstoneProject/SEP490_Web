export const formatToLocalTime = (dateString: string): string => {
  if (!dateString) return "";
  
  // Mẹo nhỏ: Thêm chữ 'Z' nếu chuỗi từ Backend thiếu, để ép hệ thống hiểu là giờ UTC
  const cleanDateString = dateString.endsWith("Z") ? dateString : dateString + "Z";
  const date = new Date(cleanDateString);
  
  // Tự động convert sang múi giờ Việt Nam (GMT+7) và format định dạng
  return date.toLocaleString("vi-VN", {
    timeZone: "Asia/Ho_Chi_Minh",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};
