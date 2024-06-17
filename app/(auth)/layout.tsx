import type { PropsWithChildren } from "react";
import Image from "next/image";
import logo from "public/logo/church_in_bolingbrook.png";

export default function AuthLayout({ children }: PropsWithChildren) {
  return (
    <div className="min-h-screen">
      <div className="container flex h-screen w-screen flex-col items-center justify-center">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="mb-2 flex flex-col text-center">
            <Image
              src={logo}
              alt="Pictography of the words The church in Lemont logo"
              width={592}
              height={171}
              className="mx-auto"
            />
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
