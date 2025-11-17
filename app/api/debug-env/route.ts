import { NextResponse } from "next/server";

export function GET() {
  return NextResponse.json({
    DATABASE_URL: process.env.DATABASE_URL || "NOT FOUND",
    POSTGRES_URL: process.env.POSTGRES_URL || "NOT FOUND",
    PRISMA_DATABASE_URL: process.env.PRISMA_DATABASE_URL || "NOT FOUND",
  });
}
