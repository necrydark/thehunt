import LoginForm from "@/components/forms/login";

export async function generateMetadata() {
  return {
    title: `Login`,
    description: `Register and login with your Twitch account to start hunting.`,
  };
}

export default function LoginPage() {
  return (
    <div className="min-h-screen w-full relative">
      <div
        className="absolute inset-0 z-0"
        style={{
          background:
            "radial-gradient(125% 125% at 50% 90%, #000000 40%, #072607 100%)",
        }}
      />
      <div className="h-full w-full relative z-10">
        <div className="container relative max-w-xl mx-auto px-4 pt-[15rem]">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
