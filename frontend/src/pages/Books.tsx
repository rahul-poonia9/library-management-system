import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { BooksContent } from "@/components/BooksContent";

const Books = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50">
        <AppSidebar />
        <BooksContent />
      </div>
    </SidebarProvider>
  );
};

export default Books;
