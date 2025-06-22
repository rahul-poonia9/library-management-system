import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sidebar } from "@/components/ui/sidebar";
import { BookOpen, Users, BookPlus, LayoutDashboard } from "lucide-react";

const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Books", href: "/books", icon: BookOpen },
  { name: "Students", href: "/students", icon: Users },
  { name: "Book Issues", href: "/issue-book", icon: BookPlus },
];

export function AppSidebar() {
  const location = useLocation();

  return (
    <Sidebar className="border-r bg-gray-100/40 w-[240px] max-w-[240px]">
      <ScrollArea className="flex-1">
        <div className="space-y-4 py-4">
          <div className="px-3 py-2">
            <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
              Library Management
            </h2>
            <div className="space-y-1">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <Button
                    key={item.name}
                    variant="ghost"
                    className={cn(
                      "w-full justify-start",
                      location.pathname === item.href && "bg-gray-200"
                    )}
                    asChild
                  >
                    <Link to={item.href}>
                      <Icon className="mr-2 h-4 w-4" />
                      {item.name}
                    </Link>
                  </Button>
                );
              })}
            </div>
          </div>
        </div>
      </ScrollArea>
    </Sidebar>
  );
} 