import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: { signIn: "/login" },
});

export const config = {
  matcher: ["/dashboard/:path*", "/leads/:path*", "/pipeline/:path*", "/contacts/:path*", "/follow-ups/:path*"],
};
