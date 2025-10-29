import React from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  LayoutDashboard,
  FileText,
  FolderOpen,
  Users,
  Sparkles,
  Settings,
  LogOut,
  TrendingUp,
  BarChart3,
  MessageCircle,
} from "lucide-react";
import { useSiteSettings } from "@/contexts/SiteSettingsContext";

const menuItems = [
  {
    href: "/admin",
    label: "Dashboard",
    icon: LayoutDashboard,
    description: "Overview & Analytics",
  },
  {
    href: "/admin/posts",
    label: "Posts",
    icon: FileText,
    description: "Manage Articles",
  },
  {
    href: "/admin/categories",
    label: "Categories",
    icon: FolderOpen,
    description: "Organize Content",
  },
  {
    href: "/admin/comments",
    label: "Comments",
    icon: MessageCircle,
    description: "Manage Comments",
  },
  {
    href: "/admin/users",
    label: "Users",
    icon: Users,
    description: "User Management",
  },
  {
    href: "/admin/create-post",
    label: "AI Creator",
    icon: Sparkles,
    description: "Generate Content",
    badge: "AI",
  },
  {
    href: "/admin/page-builder",
    label: "Page Builder",
    icon: FileText,
    description: "Create Custom Pages",
    badge: "NEW",
  },
  {
    href: "/admin/settings",
    label: "Site Settings",
    icon: Settings,
    description: "Configure Site",
  },
];

export function AdminSidebar() {
  const location = useLocation();
  const { logout, user } = useAuth();
  const { settings } = useSiteSettings();

  const brandName = settings?.brand_name || "OnAssist";

  const handleLogout = async () => {
    await logout();
  };

  return (
    <aside className="w-72 bg-gradient-to-b from-slate-900 to-slate-800 text-white min-h-screen shadow-2xl">
      {/* Header */}
      <div className="p-6 border-b border-slate-700">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
            <BarChart3 className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white group-hover:text-blue-300 transition-colors">
              {brandName}
            </h1>
            <p className="text-xs text-slate-400">Admin Dashboard</p>
          </div>
        </Link>
      </div>

      {/* User Info */}
      <div className="p-6 border-b border-slate-700">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-lg">
              {user?.name?.charAt(0).toUpperCase() || "A"}
            </span>
          </div>
          <div>
            <p className="font-medium text-white">{user?.name || "Admin"}</p>
            <div className="flex items-center gap-2">
              <Badge className="bg-green-500/20 text-green-300 border-green-500/30 text-xs">
                {user?.role || "admin"}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="p-4 flex-1">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.href;
            const Icon = item.icon;

            return (
              <li key={item.href}>
                <Link
                  to={item.href}
                  className={cn(
                    "flex items-center gap-4 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group relative overflow-hidden",
                    isActive
                      ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg scale-105"
                      : "text-slate-300 hover:bg-slate-700/50 hover:text-white hover:scale-105 hover:shadow-lg"
                  )}
                >
                  <div
                    className={cn(
                      "p-2 rounded-lg transition-colors",
                      isActive
                        ? "bg-white/20"
                        : "bg-slate-700/50 group-hover:bg-slate-600/50"
                    )}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span>{item.label}</span>
                      {item.badge && (
                        <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs px-2 py-0.5">
                          {item.badge}
                        </Badge>
                      )}
                    </div>
                    <p
                      className={cn(
                        "text-xs transition-colors",
                        isActive
                          ? "text-blue-100"
                          : "text-slate-500 group-hover:text-slate-400"
                      )}
                    >
                      {item.description}
                    </p>
                  </div>
                  {isActive && (
                    <div className="w-1 h-8 bg-white rounded-full"></div>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-slate-700">
        <Button
          variant="ghost"
          onClick={handleLogout}
          className="w-full justify-start text-slate-300 hover:text-white hover:bg-red-500/20 transition-all duration-200"
        >
          <LogOut className="h-5 w-5 mr-3" />
          Sign Out
        </Button>
      </div>
    </aside>
  );
}
