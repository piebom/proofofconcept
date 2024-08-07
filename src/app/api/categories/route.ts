import prisma from "@/lib/db"

import { NextResponse } from "next/server";

// To handle a GET request to /api
export async function GET(request:Request) {
  // Do whatever you want
  return NextResponse.json(await prisma.category.findMany())
}