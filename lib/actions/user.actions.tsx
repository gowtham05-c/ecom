"use server";

import { signInFormSchema, signUpFormSchema } from "../validator";
// import { signOut, signIn } from "next-auth/react";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { hashSync } from "bcrypt-ts-edge";
import { prisma } from "@/db/prisma";
import { formatError } from "../utils";
import { signIn, signOut } from "@/auth";
import { SignInResponse } from "@/types";

export async function signInWithCredentials(
  prevState: unknown,
  formData: FormData
): Promise<SignInResponse> {
  try {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const user = signInFormSchema.parse({
      email: formData.get("email"),
      password: formData.get("password"),
      redirect: false,
    });
    await signIn("credentials", user);
    return { success: true, message: "User logged in !!" };
  } catch (err) {
    if (isRedirectError(err)) {
      throw err;
    }

    return { success: false, message: "Invalid credentials" };
  }
}

export async function signOutUser() {
  await signOut();
}

export async function signUpUser(prevState: unknown, formData: FormData) {
  try {
    const user = signUpFormSchema.parse({
      name: formData.get("name"),
      email: formData.get("email"),
      password: formData.get("password"),
      confirmPassword: formData.get("confirmPassword"),
    });
    const plainPassword = user.password;
    user.password = hashSync(user.password, 10);

    await prisma.user.create({
      data: {
        name: user.name,
        email: user.email,
        password: user.password,
      },
    });

    await signIn("credentials", {
      email: user.email,
      password: plainPassword,
    });

    return { success: true, message: "User registered successfully!" };
  } catch (err) {
    if (isRedirectError(err)) {
      throw err;
    }
    return { success: false, message: formatError(err) };
  }
}
