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
