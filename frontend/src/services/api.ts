import { Doctor, Appointment, AppointmentFormData } from "@/types";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const api = {
  // Doctor endpoints
  getDoctors: async (): Promise<Doctor[]> => {
    const response = await fetch(`${API_BASE_URL}/doctors`);
    if (!response.ok) {
      throw new Error("Failed to fetch doctors");
    }
    return response.json();
  },

  getDoctorById: async (id: string): Promise<Doctor | null> => {
    const response = await fetch(`${API_BASE_URL}/doctors/${id}`);
    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error("Failed to fetch doctor");
    }
    return response.json();
  },

  // Search doctors
  searchDoctors: async (query: string): Promise<Doctor[]> => {
    const doctors = await api.getDoctors();
    const lowercaseQuery = query.toLowerCase();
    return doctors.filter(
      (doctor) =>
        doctor.name.toLowerCase().includes(lowercaseQuery) ||
        doctor.specialization.toLowerCase().includes(lowercaseQuery)
    );
  },

  // Appointment endpoints
  bookAppointment: async (
    appointmentData: AppointmentFormData & { doctorId: string }
  ): Promise<Appointment> => {
    const response = await fetch(`${API_BASE_URL}/appointments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(appointmentData),
    });

    if (!response.ok) {
      if (response.status === 400) {
        const errorData = await response.json();
        throw new Error(errorData.errorMessage);
      }
      throw new Error("Failed to book appointment");
    }

    return response.json();
  },

  getAppointmentsByDoctor: async (doctorId: string): Promise<Appointment[]> => {
    const response = await fetch(`${API_BASE_URL}/appointments/${doctorId}`);
    if (!response.ok) {
      throw new Error("Failed to fetch appointments");
    }
    return response.json();
  },
};
