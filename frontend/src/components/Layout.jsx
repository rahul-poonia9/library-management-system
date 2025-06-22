import React from 'react';
import { Link, useLocation, useNavigate } from "react-router-dom";
import { cn } from "../lib/utils.js";
import { BookOpen, Users, BookCopy, LayoutDashboard, LogOut } from "lucide-react";
import { useAuth } from "../contexts/AuthContext.jsx";
import { Button } from "./ui/button";
import { useToast } from "./ui/use-toast";

const navItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Books",
    href: "/books",
    icon: BookOpen,
  },
  {
    title: "Students",
    href: "/students",
    icon: Users,
  },
  {
    title: "Issue Books",
    href: "/issue-book",
    icon: BookCopy,
  },
];

export function Layout({ children }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { toast } = useToast();

  const handleLogout = async () => {
    try {
      await logout();
      toast({
        title: "Logged out successfully",
        description: "You have been logged out of your account.",
      });
      navigate("/login");
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Logout failed",
        description: "There was an error logging out. Please try again.",
      });
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r flex flex-col">
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold">Library Management</h2>
          {user && (
            <p className="text-sm text-gray-600 mt-1">
              Welcome, {user.username}
            </p>
          )}
        </div>
        <nav className="p-4 space-y-2 flex-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  "flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-100",
                  location.pathname === item.href && "bg-gray-100 text-gray-900"
                )}
              >
                <Icon className="h-5 w-5" />
                <span>{item.title}</span>
              </Link>
            );
          })}
        </nav>
        {/* Logout Button - only show if user is logged in */}
        {user && (
          <div className="p-4 border-t">
            <Button
              variant="ghost"
              className="w-full justify-start"
              onClick={handleLogout}
            >
              <LogOut className="h-5 w-5 mr-3" />
              Logout
            </Button>
          </div>
        )}
      </aside>

      {/* Main Content */}
      <main className="flex-1 bg-gray-50">
        {children}
      </main>
    </div>
  );
} 