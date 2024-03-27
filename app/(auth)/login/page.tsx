import { Fragment } from "react";
import type { Metadata } from "next";
import Link from "next/link";

import { UserAuthForm } from "@/components/user-auth-form";

export const metadata: Metadata = {
  title: "Login",
  description: "Login to your account",
};

export default function LoginPage() {
  return (
    <Fragment>
      <p className="mb-4 text-clip text-sm">
        Enter your email to sign in to your account
      </p>
      <UserAuthForm className="mb-2" />
      <p className="px-8 text-center text-sm text-muted-foreground">
        <Link
          href="/register"
          className="hover:text-brand underline underline-offset-4"
        >
          Don&apos;t have an account? Sign Up
        </Link>
      </p>
    </Fragment>
  );
}
