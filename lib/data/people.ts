"use server";

import { prisma } from "@/lib/prisma";

export async function getPeople() {
  return await prisma.person.findMany();
}
