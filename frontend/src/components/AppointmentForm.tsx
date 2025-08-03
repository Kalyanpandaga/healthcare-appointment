import { useState } from "react";
import { Doctor, AppointmentFormData } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar, Clock, User, Mail, Phone } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AppointmentFormProps {
  doctor: Doctor;
  onSubmit: (data: AppointmentFormData) => Promise<void>;
  loading?: boolean;
}

export const AppointmentForm = ({
  doctor,
  onSubmit,
  loading = false,
}: AppointmentFormProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState<AppointmentFormData>({
    patientName: "",
    email: "",
    phoneNo: "",
    date: "",
    time: "",
  });

  const [errors, setErrors] = useState<Partial<AppointmentFormData>>({});
  const [error, setError] = useState<string>("");

  const validateForm = (): boolean => {
    const newErrors: Partial<AppointmentFormData> = {};

    if (!formData.patientName.trim()) {
      newErrors.patientName = "Patient name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!formData.phoneNo.trim()) {
      newErrors.phoneNo = "Phone number is required";
    }

    if (!formData.date) {
      newErrors.date = "Date is required";
    } else {
      const selectedDate = new Date(formData.date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selectedDate < today) {
        newErrors.date = "Please select a future date";
      }
    }

    if (!formData.time) {
      newErrors.time = "Time is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields correctly.",
        variant: "destructive",
      });
      return;
    }

    try {
      setError(""); // Clear any previous errors
      await onSubmit(formData);
    } catch (error: any) {
      setError(error.message);
      toast({
        title: "Booking Failed",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleChange = (field: keyof AppointmentFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear errors when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
    if (error) {
      setError("");
    }
  };

  // Generate time slots
  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 9; hour <= 17; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const time = `${hour.toString().padStart(2, "0")}:${minute
          .toString()
          .padStart(2, "0")}`;
        slots.push(time);
      }
    }
    return slots;
  };

  const timeSlots = generateTimeSlots();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-primary" />
          Book Appointment with {doctor.name}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="patientName" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Patient Name *
            </Label>
            <Input
              id="patientName"
              type="text"
              placeholder="Enter your full name"
              value={formData.patientName}
              onChange={(e) => handleChange("patientName", e.target.value)}
              className={
                errors.patientName
                  ? "border-destructive focus:ring-destructive"
                  : ""
              }
            />
            {errors.patientName && (
              <p className="text-sm text-destructive">{errors.patientName}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              Email Address *
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={(e) => handleChange("email", e.target.value)}
              className={
                errors.email ? "border-destructive focus:ring-destructive" : ""
              }
            />
            {errors.email && (
              <p className="text-sm text-destructive">{errors.email}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="phoneNo" className="flex items-center gap-2">
              <Phone className="h-4 w-4" />
              Phone Number *
            </Label>
            <Input
              id="phoneNo"
              type="tel"
              placeholder="Enter your phone number"
              value={formData.phoneNo}
              onChange={(e) => handleChange("phoneNo", e.target.value)}
              className={
                errors.phoneNo
                  ? "border-destructive focus:ring-destructive"
                  : ""
              }
            />
            {errors.phoneNo && (
              <p className="text-sm text-destructive">{errors.phoneNo}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Preferred Date *
              </Label>
              <Input
                id="date"
                type="date"
                min={new Date().toISOString().split("T")[0]}
                value={formData.date}
                onChange={(e) => handleChange("date", e.target.value)}
                className={
                  errors.date ? "border-destructive focus:ring-destructive" : ""
                }
              />
              {errors.date && (
                <p className="text-sm text-destructive">{errors.date}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="time" className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Preferred Time *
              </Label>
              <select
                id="time"
                value={formData.time}
                onChange={(e) => handleChange("time", e.target.value)}
                className={`flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${
                  errors.time
                    ? "border-destructive focus:ring-destructive"
                    : "border-input"
                }`}
              >
                <option value="">Select time</option>
                {timeSlots.map((slot) => (
                  <option key={slot} value={slot}>
                    {slot}
                  </option>
                ))}
              </select>
              {errors.time && (
                <p className="text-sm text-destructive">{errors.time}</p>
              )}
            </div>
          </div>

          {error && (
            <div className="alert alert-error text-sm">
              <span>{error}</span>
            </div>
          )}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Booking..." : "Book Appointment"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
