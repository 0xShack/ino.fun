import Image from 'next/image';
import Link from 'next/link';

export default function Header() {
  return (
    <header className="fixed top-0 left-0 p-4 z-50">
      <Link href="/">
        <Image
          src="/logo.png" // Make sure to add your logo file to the public directory
          alt="Logo"
          width={40}
          height={40}
          className="hover:opacity-80 transition-opacity"
        />
      </Link>
    </header>
  );
} 