import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 gap-16">
      <main className="flex flex-col gap-12 items-center text-center">
        <div className="space-y-4">
          <h1 className="text-6xl font-bold">INO.fun</h1>
          <p className="text-xl text-muted-foreground">The Initial Nude Offering Platform</p>
        </div>

        <div className="flex gap-6 items-center">
          <Link
            href="/enroll"
            className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] text-lg h-14 px-8"
          >
            Create
          </Link>
          
          <Link 
            href="/contribute"
            className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent text-lg h-14 px-8"
          >
            Contribute
          </Link>
        </div>

        <p className="max-w-md text-muted-foreground text-center">
          Join the revolution in digital art ownership. Create or contribute to Initial Nude Offerings in a secure, verified environment.
        </p>
      </main>
    </div>
  );
}
