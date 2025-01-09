import Image from "next/image";
import LoginForm from "@/app/components/loginForm.js";

export default function Home() {
  return (
    <div className="grid grid-rows-[auto_1fr_auto] items-center justify-items-center min-h-screen p-8 gap-16 sm:p-20 bg-gray-900 text-teal-400 font-[family-name:var(--font-geist-sans)]">
      <header className="flex flex-col items-center gap-4">
        <Image
          src="/logo.png"
          alt="FleetSync logo"
          width={180}
          height={38}
          priority
        />
        <h1 className="text-3xl font-bold">FleetSync</h1>
      </header>

      <main className="flex flex-col items-center w-full max-w-lg p-8 bg-gray-800 rounded-md shadow-lg">
        <h2 className="text-xl font-semibold mb-6 text-center">
          Welcome to FleetSync
        </h2>
        <LoginForm />
      </main>

      <footer className="text-sm text-gray-500">
        © {new Date().getFullYear()} FleetSync. All rights reserved.
      </footer>
    </div>
  );
}
