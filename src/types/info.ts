export type Object = {
  values: string;
};

export type Slot = {
  id: string;
  slotID?: string;
  startTime: string;
  endTime: string;
  weekDate: string;
  vetFirstName: string;
  vetLastName: string;
  vetId: string;
  slotStartTime: string;
  slotEndTime: string;
  task: string;
  day: string;
};

export type Profile = {
  userId: string;
  userName: string;
  firstName: string;
  lastName: string;
  email: string;
  role?: string; // Optional
  gender?: string; // Optional
  address?: string; // Optional
  imageURL?: string;
  phoneNumber: string;
};

export type koiOrPool = {
  koiOrPoolID: string;
  name: string;
  isPool: boolean;
  description: string;
  customerId: string;
};

export type Services = {
  serviceID: number;
  serviceName: string;
  description: string;
  price: number;
  estimatedDuration: number;
  imageURL: string;
  quantityPrice: number;
  isAtHome: boolean;
  isOnline: boolean;
  isDeleted: boolean;
};

export type Distance = {
  distanceID: number;
  district: string;
  area: string;
  price: number;
};

export type VetSlots = {
  isBook: boolean;
  slotID: number;
  slotStartTime: string; // Set as string for any valid time format
  slotEndTime: string; // Similarly set as string
  weekDate: string; // Set as string to allow various days
  vetId: string; // Set as string for dynamic vet IDs
  vetName: string; // Set as string for dynamic vet names
  vetFirstName: string; // Set as string for dynamic first names
  vetLastName: string; // Set as string for dynamic last names
  meetURL: string;
  startTime?: Date;
  endTime?: Date;
};

export type Payment = {
  paymentID: string | number;
  paymentType: string;
  isDeleted: boolean;
  type: string;
};

export type Booking = {
  customerId: string;
  bookingID: string;
  bookingDate: string;
  location: string;
  note: string;
  initAmount: number;
  isPaid: boolean;
  hasPres: boolean;
  paymentTypeAtBooking: string;
  serviceNameAtBooking: string;
  servicePriceAtBooking: string;
  serviceQuantityPriceAtBooking: string;
  slotStartTimeAtBooking: string;
  slotEndTimeAtBooking: string;
  slotWeekDateAtBooking: string;
  arisedMoney: number;
  bookingStatus: string;
  totalAmount: number;
  meetURL: string;
  paymentID: number;
  paymentType: string | number;
  serviceID: number;
  serviceName: string;
  slotID: string;
  slotStartTime: string;
  slotEndTime: string;
  slotWeekDate: string;
  customerID: string;
  customerName: string;
  phoneNumber: string;
  vetID: string;
  vetName: string;
  vetEmail: string;
  koiOrPoolName: string;
  imageURL: string;
  quantity: number;
  district: string;
  bookingRecordNote: string;
  hasFeedback: boolean;
  presRecID: string;
  hasBookingRecord: boolean;
};

export type User = {
  userID: string;
  firstName: string;
  lastName: string;
  role: "Customer" | "Admin" | "Vet"; // Giả sử các vai trò khác có thể tồn tại
  gender: boolean; // true cho nam, false cho nữ
  userName: string;
  email: string;
  isActive: boolean;
  isDeleted: boolean;
};

export type Vet = {
  id: string;
  vetName: string;
  firstName: string;
  lastName: string;
  gender: boolean;
  experienceYears: number | null;
  imageURL: string | null;
};

export type Prescription = {
  prescriptionRecordID?: number;
  diseaseName: string;
  symptoms: string;
  medication: string; // Thêm thuộc tính này
  frequency: string;
  medicationDetails: {
    medication: string;
    frequency: string;
  }[];
  note?: string;
  refundMoney: number | null;
  refundPercent: number | null;
  bookingID: number;
  createAt: string;
};

export type Feedback = {
  feedbackID: number;
  bookingID: number;
  customerName: string;
  rate: number; // Đánh giá (rate) dưới dạng số, ví dụ: 1 đến 5 sao
  comments: string; // Bình luận của khách hàng
  isVisible: boolean; // Trạng thái hiển thị của phản hồi
  vetName: string;
  serviceName: string;
};
