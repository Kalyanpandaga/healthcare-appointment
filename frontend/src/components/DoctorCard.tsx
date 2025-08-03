import { Doctor } from "@/types";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, MapPin, Calendar } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface DoctorCardProps {
  doctor: Doctor;
}

export const DoctorCard = ({ doctor }: DoctorCardProps) => {
  const navigate = useNavigate();

  const handleViewProfile = () => {
    navigate(`/doctor/${doctor._id}`);
  };

  const handleBookAppointment = () => {
    navigate(`/book-appointment/${doctor._id}`);
  };

  return (
    <Card className="group hover:shadow-lg transition-all duration-200 border-border hover:border-primary/30">
      <CardHeader className="pb-3">
        <div className="flex items-start gap-4">
          <div className="relative">
            <img
              src={doctor.image}
              alt={doctor.name}
              className="w-16 h-16 rounded-full object-cover ring-2 ring-primary/10"
            />
            <div
              className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-card ${
                doctor.available ? "bg-success" : "bg-muted-foreground"
              }`}
            />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-lg text-foreground group-hover:text-primary transition-colors">
              {doctor.name}
            </h3>
            <p className="text-muted-foreground font-medium">
              {doctor.specialization}
            </p>
            {doctor.rating && (
              <div className="flex items-center gap-1 mt-1">
                <Star className="h-4 w-4 fill-warning text-warning" />
                <span className="text-sm font-medium">{doctor.rating}</span>
                <span className="text-sm text-muted-foreground">
                  ({doctor.experience}+ years)
                </span>
              </div>
            )}
          </div>
          <Badge
            variant={doctor.available ? "default" : "secondary"}
            className={doctor.available ? "bg-success hover:bg-success/90" : ""}
          >
            {doctor.available ? "Available" : "Busy"}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        {doctor.location && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4" />
            <span>{doctor.location}</span>
          </div>
        )}

        {doctor.bio && (
          <p className="text-sm text-muted-foreground line-clamp-2">
            {doctor.bio}
          </p>
        )}

        <div className="flex gap-2 pt-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleViewProfile}
            className="flex-1"
          >
            View Profile
          </Button>
          <Button
            onClick={handleBookAppointment}
            disabled={!doctor.available}
            size="sm"
            className="flex-1"
          >
            <Calendar className="h-4 w-4 mr-1" />
            Book Now
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
