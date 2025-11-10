import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { saveFile } from "./utils/fileupload";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const pizzas = await prisma.pizza.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(pizzas);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const name = formData.get("name") as string;
    const priceStr = formData.get("price") as string;
    const price = parseFloat(priceStr);
    const file = formData.get("file") as File;
    const imageUrl = await saveFile(file);
    const description = formData.get("description") as string;

    if (!name || isNaN(price) || !file || !description) {
      return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    }

    const pizza = await prisma.pizza.create({
      data: { name, price, image: imageUrl, description },
    });

    return NextResponse.json(pizza);
  } catch (err) {
    console.error("Error creating pizza:", err);
    return NextResponse.json(
      { error: "Failed to create pizza" },
      { status: 500 }
    );
  }
}
