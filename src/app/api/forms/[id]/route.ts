import { NextResponse } from 'next/server';
import prisma from '@/lib/db'; // Ensure you have a proper db.ts file exporting the Prisma client

export async function GET(request: Request, { params }: { params: { id: string } }) {
    const form = await prisma.form.findUnique({
        where: { id: parseInt(params.id) },
        include: {
        category: true,
        },
    });
    return NextResponse.json(form);
    }



export async function PUT(request: Request, { params }: { params: { id: string } }) {
    const { title, categoryId, description } = await request.json();
    const form = await prisma.form.update({
      where: { id: parseInt(params.id) },
      data: {
        title,
        category: {connect: {
          id: parseInt(categoryId),
        }},
        description,
      },
    });
    return NextResponse.json(form);
  }
  
  export async function DELETE(request: Request, { params }: { params: { id: string } }) {
    await prisma.form.delete({
      where: { id: parseInt(params.id) },
    });
    return NextResponse.json({ success: true });
  }
  