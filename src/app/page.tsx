"use client"
import FormList from "@/components/formList";
import prisma from "@/lib/db";
import { Prisma } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";


const Home = () => {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1 className="text-4xl font-bold">Proof of Concept</h1>
      <FormList/>
      <Link href="/form/create">
        Formulier invullen
      </Link>
    </main>
  );
}

export default Home