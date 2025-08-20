import AdminAnalytics from "@/components/admin/admin-analytics";
import StatPanels from "@/components/admin/stat-panels";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function AdminPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (session?.user.role === "Reviewer") {
    redirect("/admin/submissions");
  }

  if (!session || session.user.role !== "Admin") {
    redirect("/");
  }

  return (
    <div className="container mx-auto relative z-10 px-4 py-8">
      <h1 className="text-3xl text-primary-green leading-tight mb-8 font-bold">
        Dashboard
      </h1>
      <StatPanels />
      <AdminAnalytics />
    </div>
  );
}
