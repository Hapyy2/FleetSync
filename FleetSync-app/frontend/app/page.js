import Image from "next/image";
import LoginForm from "@/app/components/loginForm.js";

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <Image
          src="/logo.png"
          alt="FleetSync logo"
          width={180}
          height={38}
          priority
        />
        <a>FleetSync</a>
        <div className="min-h-screen flex items-center justify-center bg-gray-900">
          <LoginForm />
        </div>
      </main>
    </div>
  );
}
