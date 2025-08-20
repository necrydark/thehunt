"use client";
import { authClient } from "@/lib/auth-client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import UserDropdown from "./user-dropdown";

export default function UserButton() {
  const router = useRouter();
  const session = authClient.useSession();

  if (session.isPending) {
    return null;
  }

  const user = session?.data?.user;

  if (user) {
    return (
      <UserDropdown
        user={{
          ...user,
          role: user.role ?? undefined,
        }}
        onSignOut={() => {
          authClient.signOut({
            fetchOptions: {
              onSuccess: () => {
                router.push("/");
              },
            },
          });
        }}
      />
    );
  }
  return (
    <div>
      <Link
        href={"/login"}
        className="font-semibold text-white hover:text-green-400 transition-all duration-300 px-4 py-2 rounded-lg hover:bg-green-500/10 relative group"
      >
        Login
        <span className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-green-400 group-hover:w-full group-hover:left-0 transition-all duration-300"></span>
      </Link>
    </div>
  );
}
