import { Menu } from "lucide-react";

export function SidebarTrigger({ onClick }) {
  return (
    <button onClick={onClick} className="p-2 rounded hover:bg-gray-200">
      <Menu className="h-6 w-6" />
    </button>
  );
} 