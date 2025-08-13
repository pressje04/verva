// app/login/page.tsx
import LoginForm from "@/components/LoginForm";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center landing-background dark:bg-[#0a0a0a]">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-lg">
        <h2 className="text-2xl text-black font-bold mb-6 text-center">Welcome Back</h2>
        <LoginForm />
      </div>
    </div>
  );
}
