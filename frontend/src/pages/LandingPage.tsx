import { useState, useEffect } from "react";
import { Doctor } from "@/types";
import { api } from "@/services/api";
import { SearchBar } from "@/components/SearchBar";
import { DoctorCard } from "@/components/DoctorCard";
import { MainLayout } from "@/components/layouts/MainLayout";
import { Skeleton } from "@/components/ui/skeleton";
import { Users, Search } from "lucide-react";

export const LandingPage = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [filteredDoctors, setFilteredDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    loadDoctors();
  }, []);

  const loadDoctors = async () => {
    try {
      setLoading(true);
      const doctorsData = await api.getDoctors();
      setDoctors(doctorsData);
      setFilteredDoctors(doctorsData);
    } catch (error) {
      console.error("Failed to load doctors:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (query: string) => {
    setSearchQuery(query);

    if (!query.trim()) {
      setFilteredDoctors(doctors);
      return;
    }

    try {
      const searchResults = await api.searchDoctors(query);
      setFilteredDoctors(searchResults);
    } catch (error) {
      console.error("Search failed:", error);
      // Fallback to local filtering
      const filtered = doctors.filter(
        (doctor) =>
          doctor.name.toLowerCase().includes(query.toLowerCase()) ||
          doctor.specialization.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredDoctors(filtered);
    }
  };

  const availableDoctors = filteredDoctors.filter((doctor) => doctor.available);
  const unavailableDoctors = filteredDoctors.filter(
    (doctor) => !doctor.available
  );

  return (
    <MainLayout>
      <div className="space-y-8">
        {/* Hero Section */}
        <section className="text-center space-y-4 py-8">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground">
            Find Your Perfect
            <span className="text-primary block">Healthcare Provider</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Book appointments with experienced doctors in various
            specializations. Quality healthcare is just a click away.
          </p>
        </section>

        {/* Search Section */}
        <section className="max-w-2xl mx-auto">
          <SearchBar
            onSearch={handleSearch}
            placeholder="Search by doctor name or specialization..."
            className="w-full"
          />
        </section>

        {/* Stats */}
        {!loading && (
          <section className="flex justify-center">
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                <span>{doctors.length} doctors available</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-success rounded-full" />
                <span>{availableDoctors.length} currently available</span>
              </div>
            </div>
          </section>
        )}

        {/* Search Results Info */}
        {searchQuery && !loading && (
          <section className="flex items-center gap-2 text-muted-foreground">
            <Search className="h-4 w-4" />
            <span>
              {filteredDoctors.length > 0
                ? `Found ${filteredDoctors.length} doctor${
                    filteredDoctors.length === 1 ? "" : "s"
                  } for "${searchQuery}"`
                : `No doctors found for "${searchQuery}"`}
            </span>
          </section>
        )}

        {/* Loading State */}
        {loading && (
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="space-y-4 p-4 border rounded-lg">
                <div className="flex items-start gap-4">
                  <Skeleton className="w-16 h-16 rounded-full" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-5 w-32" />
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-20" />
                  </div>
                </div>
                <Skeleton className="h-4 w-full" />
                <div className="flex gap-2">
                  <Skeleton className="h-8 flex-1" />
                  <Skeleton className="h-8 flex-1" />
                </div>
              </div>
            ))}
          </section>
        )}

        {/* Available Doctors */}
        {!loading && availableDoctors.length > 0 && (
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground flex items-center gap-2">
              <div className="w-2 h-2 bg-success rounded-full" />
              Available Now
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {availableDoctors.map((doctor) => (
                <DoctorCard key={doctor._id} doctor={doctor} />
              ))}
            </div>
          </section>
        )}

        {/* Unavailable Doctors */}
        {!loading && unavailableDoctors.length > 0 && (
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground flex items-center gap-2">
              <div className="w-2 h-2 bg-muted-foreground rounded-full" />
              Currently Busy
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {unavailableDoctors.map((doctor) => (
                <DoctorCard key={doctor._id} doctor={doctor} />
              ))}
            </div>
          </section>
        )}

        {/* No Results */}
        {!loading && filteredDoctors.length === 0 && searchQuery && (
          <section className="text-center py-12 space-y-4">
            <Search className="h-12 w-12 text-muted-foreground mx-auto" />
            <h3 className="text-xl font-semibold text-foreground">
              No doctors found
            </h3>
            <p className="text-muted-foreground">
              Try adjusting your search or browse all available doctors.
            </p>
          </section>
        )}
      </div>
    </MainLayout>
  );
};
