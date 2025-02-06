import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import dbConnect from "@/lib/mongodb";

const options = {
    providers: [
        CredentialsProvider({
            // The name to display on the sign-in form (e.g. 'Sign in with...')
            name: 'Credentials',
            credentials: {
                username: { label: "Username", type: "text" },
                password: {  label: "Password", type: "password" }
            },
            authorize: async (credentials) =>{
                //Connect to db
                await dbConnect();

                
            }
        })
    ],
    pages: {
        signIn: '/auth/signin',
        signOut: '/auth/signout',
        error: '/auth/error', // Error code passed in query string as ?error=
        verifyRequest: '/auth/verify-request', // (used for check email message)
        newUser: '/auth/userUser' // If set, new users will be directed here on first sign in
    },
    secret: process.env.NEXTAUTH_SECRET,
    session: {
        jwt: true,
    },
    callbacks: {
        async jwt(token, user) {
            if (user) {
                token.id = user.id;
            }
            return token;
        },
        async session(session, token) {
            session.user.id = token.id;
            return session;
        }
    }
}


const handler = NextAuth(options);

export { handler as GET, handler as POST };
