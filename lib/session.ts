"use server";

import { getServerAuthSession } from "@/lib/auth";

export async function getCurrentUser() {
  const session = await getServerAuthSession();
  return session?.user;
}
