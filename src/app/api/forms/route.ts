import { NextResponse } from 'next/server';
import prisma from '@/lib/db'; // Ensure you have a proper db.ts file exporting the Prisma client

export async function GET() {
  const forms = await prisma.form.findMany({
    include: {
        category: true,
    },
    orderBy: {
      updatedAt: 'desc',
    },
  });
  return NextResponse.json(forms);
}

export async function POST(request: Request) {
  const { title, category, description } = await request.json();
  const form = await prisma.form.create({
    data: {
      title,
      category: {connect: {
        id: parseInt(category),
      }},
      description,
    },
  });
  return NextResponse.json(form, { status: 201 });
}
