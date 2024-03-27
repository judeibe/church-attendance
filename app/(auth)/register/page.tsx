import { Fragment, Suspense } from "react";

import { SkeletonCard } from "@/components/skeleton-card";
import { UserAuthForm } from "@/components/user-auth-form";

export const metadata = {
  title: "Create an account",
  description: "Create an account to get started.",
};

export default function RegisterPage() {
  return (
    <Fragment>
      <p className="mb-4 text-clip text-sm">
        Enter your email to create your account
      </p>
      <Suspense fallback={<SkeletonCard />}>
        <UserAuthForm />
      </Suspense>
    </Fragment>
  );
}
