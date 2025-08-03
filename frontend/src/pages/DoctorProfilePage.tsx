import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Doctor } from "@/types";
import { api } from "@/services/api";
import { MainLayout } from "@/components/layouts/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ArrowLeft,
  Calendar,
  Star,
  MapPin,
  Clock,
  User,
  Award,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export const DoctorProfilePage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [loading, setLoading] = useState(true);

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
    } finally {
      setLoading(false);
    }
  };

  const handleBookAppointment = () => {
    if (doctor && doctor.available) {
      navigate(`/book-appointment/${doctor._id}`);
    }
  };

  const handleBack = () => {
    navigate("/");
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="space-y-6">
          <Skeleton className="h-10 w-32" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-start gap-4">
                    <Skeleton className="w-24 h-24 rounded-full" />
                    <div className="space-y-2 flex-1">
                      <Skeleton className="h-8 w-48" />
                      <Skeleton className="h-5 w-32" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-20 w-full" />
                </CardContent>
              </Card>
            </div>
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <Skeleton className="h-6 w-32" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-10 w-full" />
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
          <Button onClick={handleBack} className="mt-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={handleBack}
          className="text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Doctors
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Profile */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-start gap-6">
                  <div className="relative">
                    <img
                      src={doctor.image}
                      alt={doctor.name}
                      className="w-24 h-24 rounded-full object-cover ring-4 ring-primary/10"
                    />
                    <div
                      className={`absolute -bottom-2 -right-2 w-6 h-6 rounded-full border-4 border-card ${
                        doctor.available ? "bg-success" : "bg-muted-foreground"
                      }`}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between flex-wrap gap-4">
                      <div>
                        <h1 className="text-3xl font-bold text-foreground">
                          {doctor.name}
                        </h1>
                        <p className="text-xl text-muted-foreground font-medium">
                          {doctor.specialization}
                        </p>
                        {doctor.rating && (
                          <div className="flex items-center gap-2 mt-2">
                            <div className="flex items-center gap-1">
                              <Star className="h-5 w-5 fill-warning text-warning" />
                              <span className="font-semibold">
                                {doctor.rating}
                              </span>
                            </div>
                            {doctor.experience && (
                              <span className="text-muted-foreground">
                                • {doctor.experience}+ years experience
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                      <Badge
                        variant={doctor.available ? "default" : "secondary"}
                        className={`${
                          doctor.available
                            ? "bg-success hover:bg-success/90"
                            : ""
                        } text-sm px-3 py-1`}
                      >
                        {doctor.available ? "Available Now" : "Currently Busy"}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardHeader>

              {doctor.bio && (
                <CardContent>
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                      <User className="h-5 w-5" />
                      About Dr. {doctor.name.split(" ").pop()}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {doctor.bio}
                    </p>
                  </div>
                </CardContent>
              )}
            </Card>

            {/* Additional Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  Professional Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="font-medium">Available Hours</p>
                        <p className="text-sm text-muted-foreground">
                          9:00 AM - 6:00 PM
                        </p>
                      </div>
                    </div>
                    {doctor.location && (
                      <div className="flex items-center gap-3">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="font-medium">Location</p>
                          <p className="text-sm text-muted-foreground">
                            {doctor.location}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="space-y-3">
                    {doctor.experience && (
                      <div className="flex items-center gap-3">
                        <Award className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="font-medium">Experience</p>
                          <p className="text-sm text-muted-foreground">
                            {doctor.experience}+ years
                          </p>
                        </div>
                      </div>
                    )}
                    <div className="flex items-center gap-3">
                      <Star className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="font-medium">Patient Rating</p>
                        <p className="text-sm text-muted-foreground">
                          {doctor.rating || "Not rated"}/5.0
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Booking Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Book Appointment
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center space-y-2">
                  <p className="text-sm text-muted-foreground">
                    Ready to schedule your appointment?
                  </p>
                  <Button
                    onClick={handleBookAppointment}
                    disabled={!doctor.available}
                    className="w-full"
                    size="lg"
                  >
                    <Calendar className="h-4 w-4 mr-2" />
                    {doctor.available ? "Book Now" : "Currently Unavailable"}
                  </Button>
                  {!doctor.available && (
                    <p className="text-xs text-muted-foreground">
                      This doctor is currently busy. Please check back later.
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Quick Info */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Specialization</span>
                  <span className="font-medium">{doctor.specialization}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Availability</span>
                  <Badge variant={doctor.available ? "default" : "secondary"}>
                    {doctor.available ? "Available" : "Busy"}
                  </Badge>
                </div>
                {doctor.experience && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Experience</span>
                    <span className="font-medium">
                      {doctor.experience}+ years
                    </span>
                  </div>
                )}
                {doctor.rating && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Rating</span>
                    <span className="font-medium flex items-center gap-1">
                      {doctor.rating}
                      <Star className="h-3 w-3 fill-warning text-warning" />
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};
