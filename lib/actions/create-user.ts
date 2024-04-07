"use server";

import { userAuthSchema } from "@/lib/validations/auth";

export async function createUser(prevState: any, formData: FormData) {
  const validatedFields = userAuthSchema.safeParse({
    email: formData.get("email"),
  });

  // Return early if the form data is invalid
  if (!validatedFields.success) {
    return {
      message: validatedFields.error,
    };
  }

  return {
    message: validatedFields,
  };
}
