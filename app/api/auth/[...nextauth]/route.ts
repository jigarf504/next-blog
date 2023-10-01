import nextAuth, { AuthOptions } from "next-auth";
import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { connectToDb } from "@/lib/helpers";
import prisma from "@/prisma";
import bcrypt from "bcrypt";
export const authOptions: AuthOptions = {
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_ID as string,
      clientSecret: process.env.GITHUB_SECRET as string,
    }),
    GoogleProvider({
      clientId: process.env.GITHUB_ID as string,
      clientSecret: process.env.GITHUB_SECRET as string,
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { type: "text" },
        password: { type: "password" },
      },
      async authorize(credentials: any) {
        if (!credentials || !credentials.email || !credentials.password) {
          return null;
        }

        try {
          await connectToDb();
          const user = await prisma.user.findFirst({
            where: { email: credentials.email },
          });

          console.log(credentials,user)
          if (!user) {
            return null;
          }

          if (!user.password) {
            return null;
          }

          const hasPasswordMatch = await bcrypt.compare(
            credentials.password,
            user.password
          );

          if (!hasPasswordMatch) {
            return null;
          }

          return { ...user, id: user.id };
        } catch (err) {} finally {
          await prisma.$disconnect();
        }
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET as string,
};
const handler = nextAuth(authOptions);

export { handler as GET, handler as POST };
