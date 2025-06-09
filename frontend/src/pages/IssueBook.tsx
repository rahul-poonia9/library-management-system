import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { IssueBookContent } from "@/components/IssueBookContent";

const IssueBook = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50">
        <AppSidebar />
        <IssueBookContent />
      </div>
    </SidebarProvider>
  );
};

export default IssueBook;
