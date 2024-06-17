import { withAuth } from "next-auth/middleware";

export default withAuth({
  callbacks: {
    async authorized({ token }) {
      return !!token;
    },
  },
});

export const config = {
  matcher: ["/((?!api|login|register|_next/static|_next/image|favicon.ico).*)"],
};
