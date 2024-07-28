import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1 className="text-4xl font-bold">Proof of Concept</h1>
      <p className="text-lg">
        Offline-first proof of concept
      </p>
      <Link href="/form/create">
        Formulier invullen
      </Link>
    </main>
  );
}
