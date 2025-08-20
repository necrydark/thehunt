import { AppSidebar } from "@/components/admin/app-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

type Props = {
  children: React.ReactNode;
};

const AdminLayout = ({ children }: Props) => {
  return (
    <SidebarProvider>
      <AppSidebar />
      <div className="min-h-screen w-full relative">
        <div className="p-4 h-12">
          <SidebarTrigger className="relative z-10 text-white hover:bg-primary-green" />
        </div>
        <div
          className="absolute inset-0 z-0"
          style={{
            background:
              "radial-gradient(125% 125% at 50% 90%, #000000 40%, #072607 100%)",
          }}
        />
        {children}
      </div>
    </SidebarProvider>
  );
};

export default AdminLayout;
