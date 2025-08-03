import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Doctor, AppointmentFormData, Appointment } from "@/types";
import { api } from "@/services/api";
import { MainLayout } from "@/components/layouts/MainLayout";
import { AppointmentForm } from "@/components/AppointmentForm";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ArrowLeft,
  CheckCircle,
  Calendar,
  User,
  Mail,
  Phone,
  Clock,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export const BookAppointmentPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);
  const [appointment, setAppointment] = useState<Appointment | null>(null);

  useEffect(() => {
    if (id) {
      loadDoctor(id);
    }
  }, [id]);

  const loadDoctor = async (doctorId: string) => {
    try {
      setLoading(true);
      const doctorData = await api.getDoctorById(doctorId);
      if (doctorData) {
        setDoctor(doctorData);
        if (!doctorData.available) {
          toast({
            title: "Doctor Unavailable",
            description:
              "This doctor is currently not available for appointments.",
            variant: "destructive",
          });
          navigate(`/doctor/${doctorId}`);
        }
      } else {
        toast({
          title: "Doctor not found",
          description: "The requested doctor could not be found.",
          variant: "destructive",
        });
        navigate("/");
      }
    } catch (error) {
      console.error("Failed to load doctor:", error);
      toast({
        title: "Error loading doctor",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
      navigate("/");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (formData: AppointmentFormData) => {
    if (!doctor) return;

    try {
      setBooking(true);
      const newAppointment = await api.bookAppointment({
        ...formData,
        doctorId: doctor._id,
      });

      setAppointment(newAppointment);
      toast({
        title: "Appointment Booked!",
        description: "Your appointment has been successfully scheduled.",
      });
    } catch (error) {
      console.error("Failed to book appointment:", error);
      throw error; // Re-throw to let form handle it
    } finally {
      setBooking(false);
    }
  };

  const handleBack = () => {
    if (appointment) {
      navigate("/");
    } else {
      navigate(doctor ? `/doctor/${doctor._id}` : "/");
    }
  };

  const handleBookAnother = () => {
    setAppointment(null);
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="space-y-6">
          <Skeleton className="h-10 w-32" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <Card>
                <CardHeader>
                  <Skeleton className="h-6 w-48" />
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <div key={i} className="space-y-2">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-10 w-full" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
            <div>
              <Card>
                <CardHeader>
                  <Skeleton className="h-6 w-32" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-32 w-full" />
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (!doctor) {
    return (
      <MainLayout>
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-foreground">
            Doctor not found
          </h1>
          <Button onClick={() => navigate("/")} className="mt-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
        </div>
      </MainLayout>
    );
  }

  // Success view
  if (appointment) {
    return (
      <MainLayout>
        <div className="max-w-2xl mx-auto space-y-6">
          <Button
            variant="ghost"
            onClick={handleBack}
            className="text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>

          <Card className="border-success/20 bg-success/5">
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="h-8 w-8 text-success" />
              </div>
              <CardTitle className="text-2xl text-success">
                Appointment Confirmed!
              </CardTitle>
              <p className="text-muted-foreground">
                Your appointment has been successfully booked with Dr.{" "}
                {doctor.name}
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Appointment Details */}
              <div className="bg-card border rounded-lg p-4 space-y-3">
                <h3 className="font-semibold text-foreground">
                  Appointment Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Patient:</span>
                    <span className="font-medium">
                      {appointment.patientName}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Date:</span>
                    <span className="font-medium">
                      {new Date(appointment.date).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Time:</span>
                    <span className="font-medium">{appointment.time}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Email:</span>
                    <span className="font-medium">{appointment.email}</span>
                  </div>
                  {appointment.phone && (
                    <div className="flex items-center gap-2 md:col-span-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Phone:</span>
                      <span className="font-medium">{appointment.phone}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Doctor Info */}
              <div className="bg-card border rounded-lg p-4">
                <h3 className="font-semibold text-foreground mb-3">
                  Doctor Information
                </h3>
                <div className="flex items-center gap-4">
                  <img
                    src={doctor.image}
                    alt={doctor.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-medium">{doctor.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {doctor.specialization}
                    </p>
                    {doctor.location && (
                      <p className="text-xs text-muted-foreground">
                        {doctor.location}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Next Steps */}
              <div className="bg-primary-soft border border-primary/20 rounded-lg p-4">
                <h3 className="font-semibold text-foreground mb-2">
                  What's Next?
                </h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• You'll receive a confirmation email shortly</li>
                  <li>• The doctor's office may call to confirm details</li>
                  <li>• Please arrive 15 minutes early for your appointment</li>
                  <li>
                    • Bring any relevant medical records or insurance cards
                  </li>
                </ul>
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={handleBack}
                  variant="outline"
                  className="flex-1"
                >
                  Back to Home
                </Button>
                <Button onClick={handleBookAnother} className="flex-1">
                  Book Another Appointment
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </MainLayout>
    );
  }

  // Booking form view
  return (
    <MainLayout>
      <div className="space-y-6">
        <Button
          variant="ghost"
          onClick={handleBack}
          className="text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Profile
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Booking Form */}
          <div>
            <AppointmentForm
              doctor={doctor}
              onSubmit={handleSubmit}
              loading={booking}
            />
          </div>

          {/* Doctor Summary */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Doctor Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-start gap-4">
                  <img
                    src={doctor.image}
                    alt={doctor.name}
                    className="w-16 h-16 rounded-full object-cover ring-2 ring-primary/10"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{doctor.name}</h3>
                    <p className="text-muted-foreground">
                      {doctor.specialization}
                    </p>
                    {doctor.location && (
                      <p className="text-sm text-muted-foreground mt-1">
                        {doctor.location}
                      </p>
                    )}
                    <div className="flex items-center gap-2 mt-2">
                      <Badge
                        variant="default"
                        className="bg-success hover:bg-success/90"
                      >
                        Available
                      </Badge>
                      {doctor.experience && (
                        <span className="text-sm text-muted-foreground">
                          {doctor.experience}+ years
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                {doctor.bio && (
                  <p className="text-sm text-muted-foreground mt-4 leading-relaxed">
                    {doctor.bio}
                  </p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Appointment Guidelines</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="text-sm text-muted-foreground space-y-2">
                  <li>• Please arrive 15 minutes before your scheduled time</li>
                  <li>• Bring a valid ID and insurance card</li>
                  <li>• List any current medications you're taking</li>
                  <li>• Prepare questions you'd like to discuss</li>
                  <li>• You'll receive email confirmation shortly</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};
