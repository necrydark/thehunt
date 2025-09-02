import ItemsTable from "@/components/admin/items/items-table";
import { auth } from "@/lib/auth";
import { Box } from "lucide-react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export async function generateMetadata() {
  return {
    title: `Items`,
  };
}

export default async function ItemsAdminPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (session?.user.role === "Reviewer") {
    redirect("/admin/submissions");
  }

  if (!session || session.user.role !== "Admin") {
    redirect("/");
  }

  if (session.user.banned) {
    redirect("/");
  }

  return (
    <div className="container mx-auto relative z-10 px-4 py-8">
      <div className="flex gap-1 items-center mb-8">
        <Box className="h-8 w-8 text-primary-green" />
        <h1 className="text-3xl text-white leading-tight font-bold">Items</h1>
      </div>
      <ItemsTable />
    </div>
  );
}
