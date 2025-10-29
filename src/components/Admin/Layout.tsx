import { Navigate } from "react-router-dom";
import { AdminSidebar } from "./Sidebar";
import { useAuth } from "@/contexts/AuthContext";
import { useSiteSettings } from "@/contexts/SiteSettingsContext";
import React from "react";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const { isAuthenticated, isAdmin, isLoading } = useAuth();
  const { settings } = useSiteSettings();

  // Get brand name from settings
  const brandName = settings?.brand_name || "OnAssist";

  // Update document title with dynamic brand name
  React.useEffect(() => {
    document.title = `Admin Dashboard - ${brandName}`;
  }, [brandName]);

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Redirect to home if not admin
  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  // Render admin layout without any duplicate headers/footers
  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      <main className="flex-1 overflow-auto">
        <div className="p-8">{children}</div>
      </main>
    </div>
  );
}
