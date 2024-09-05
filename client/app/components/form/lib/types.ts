export type Candidate = {
  _id: string;
  firstName: string;
  lastName: string;
  rollNumber: number;
  certificateNumber: string;
  designation: string;
  phoneNumber: string;
  employeeId: string;
  email: string;
  remarks: string;
};

export type FormData = {
  firstName?: string;
  lastName?: string;
  rollNumber?: string;
  certificateNumber?: string;
  designation?: string;
  employeeId?: string;
  phoneNumber?: string;
  email?: string;
  remarks?: string;
};
