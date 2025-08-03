import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Heart, Calendar, Home } from "lucide-react";

export const Header = () => {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 h-14 flex items-center justify-between">
        <Link
          to="/"
          className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
        >
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <Heart className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="font-bold text-xl text-foreground">HealthLink</span>
        </Link>

        <nav className="flex items-center space-x-2">
          <Button
            variant={isActive("/") ? "default" : "ghost"}
            size="sm"
            asChild
          >
            <Link to="/" className="flex items-center gap-2">
              <Home className="h-4 w-4" />
              <span className="hidden sm:inline">Home</span>
            </Link>
          </Button>

          <Button variant="outline" size="sm" asChild>
            <Link to="/" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span className="hidden sm:inline">My Appointments</span>
            </Link>
          </Button>
        </nav>
      </div>
    </header>
  );
};
