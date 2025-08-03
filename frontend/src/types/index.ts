export interface Doctor {
  _id: string;
  name: string;
  specialization: string;
  image: string;
  available: boolean;
  bio?: string;
  experience?: number;
  rating?: number;
  location?: string;
}

export interface Appointment {
  _id: string;
  doctorId: string;
  patientName: string;
  email: string;
  phoneNo?: string;
  date: string;
  time: string;
  status?: "pending" | "confirmed" | "cancelled";
}

export interface AppointmentFormData {
  patientName: string;
  email: string;
  phoneNo: string;
  date: string;
  time: string;
}
