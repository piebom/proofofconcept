"use client"
import FormList from "@/components/formList";
import { Button } from "@/components/ui/button";
import prisma from "@/lib/db";
import { Prisma } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";


const Home = () => {
  const router = useRouter();
  return (
    <main className="flex flex-1 w-full flex-col justify-center items-center p-12 space-y-6">
      <FormList/>
      <Button className="w-[400px]" onClick={() => router.push('/form/create')}>Fill in a new form</Button>
    </main>
  );
}

export default Home