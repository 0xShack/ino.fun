import Image from "next/image";
import Link from "next/link";
import { WalletConnect } from "../components/WalletConnect";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 gap-16">
      <WalletConnect />
      <main className="flex flex-col gap-12 items-center text-center">
        <div className="space-y-4">
          <div className="flex justify-center">
            <Image
              src="/logo.png"
              alt="INO.fun Logo"
              width={200}
              height={60}
              priority
            />
          </div>
          <p className="text-xl text-muted-foreground">Initial Nude Offering.</p>
        </div>

        <div className="flex gap-6 items-center">
          <Link
            href="/enroll"
            className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] text-lg h-14 px-8"
          >
            Request
          </Link>
          
          <Link 
            href="/contribute"
            className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent text-lg h-14 px-8"
          >
            Fund
          </Link>
        </div>

        <p className="max-w-md text-muted-foreground text-center">
          Join the revolution. Request or Fund Initial Nude Offerings in a secure, verified environment.
        </p>
      </main>
    </div>
  );
}
