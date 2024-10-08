export type Object = {
  values: string;
};

export type Slot = {
  slotID: number;
  startTime: string;
  endTime: string;
  weekDate: string;
};

export type profile = {
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
  // Add any other fields your profile may have
};

export type koiOrPool = {
  koiOrPoolID: string;
  name: string;
  isPool: boolean;
  description: string;
  customerId: string;
};

export type services = {
  serviceID: number;
  serviceName: string;
  description: string;
  price: number;
  estimatedDuration: number;
};

export type vetSlots = {
  isBook: boolean;
  slotID: number;
  slotStartTime: string; // Set as string for any valid time format
  slotEndTime: string; // Similarly set as string
  weekDate: string; // Set as string to allow various days
  vetId: string; // Set as string for dynamic vet IDs
  vetName: string; // Set as string for dynamic vet names
  vetFirstName: string; // Set as string for dynamic first names
  vetLastName: string; // Set as string for dynamic last names
};

export type Payment = {
  paymentID: string;
  qrcode: string;
  type: string;
};

export type Booking = {
  note: string;
  koiOrPoolId: number;
  vetName: string;
  totalAmount: number;
  location: string;
  slotId: number;
  serviceId: number;
  paymentId: number;
  bookingDate: string;
};
