import UsersTable from "@/components/admin/users/users-table";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function SubmissionsAdminPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session || session.user.role !== "Admin") {
    redirect("/");
  }

  if (session.user.banned) {
    redirect("/");
  }

  return (
    <div className="container mx-auto relative z-10 px-4 py-8">
      <h1 className="text-3xl text-primary-green leading-tight mb-8 font-bold">
        Users
      </h1>
      <UsersTable />
    </div>
  );
}
