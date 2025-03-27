import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { JWT } from "next-auth/jwt";

export const  authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET, // Ensure secret is at the top level
  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 24 * 30, // 30 days
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Please enter email and password");
        }

        try {
          const res = await fetch(`${process.env.BACKEND_URL}/api/auth/login`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
            }),
          });

          if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.message || "Invalid credentials");
          }

          const data = await res.json();
          console.log(data)

          if (!data.token) {
            throw new Error("Invalid user data received");
          }



          const jwtToken = data?.token;

          const userResponse = await fetch(`${process.env.BACKEND_URL}/api/auth/user`, {
            headers: {
              Authorization: `Bearer ${jwtToken}`,
              "Content-Type": "application/json",
              Accept: "application/json",
            },
          });

          if (!userResponse.ok) {
            throw new Error("Failed to fetch user data");
          }

          const userData = await userResponse.json();

          if (!userData.user) {
            throw new Error("Invalid user data received");
          }

          const { id, name, email } = userData.user;

          return {
            id,
            email,
            name,
            token: jwtToken,
          };
        } catch (error) {
          console.error("Authentication error:", error);
          throw new Error("Authentication failed. Please try again.");
        }
      },
    }),
  ],
  callbacks: {
    //eslint-disable-next-line
    async jwt({ token, user }: { token: JWT; user?: any }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.accessToken = user.token;
      }
      return token;
    },
    //eslint-disable-next-line
    async session({ session, token }: { session: any; token: JWT }) {
      if (token) {
        session.user.id = token.id;
        session.user.name = token.name;
        session.user.email = token.email;
        session.user.token = token.accessToken;
      }
      return session;
    },
  },
};




// import { NextAuthOptions } from "next-auth";
// import { JWT } from "next-auth/jwt";
// import CredentialsProvider from "next-auth/providers/credentials"

// export const authOptions: NextAuthOptions = {
//     jwt : {
//         secret : process.env.NEXTAUTH_SECRET,
//         maxAge : 60 * 60 * 24 * 30
//     },
//     providers : [
//         CredentialsProvider({
//             name : "Credentials",
//             credentials : {
//                 email : {label : "Email", type : "email"},
//                 password : {label : "Password", type : "password"}
//             },
//             async authorize(credentials) {
//                 if(!credentials?.email || !credentials?.password){
//                     alert("Please enter email and password")
//                 }
//                 try {
//                     const res = await fetch(`${process.env.BACKEND_URL}/api/auth/login`,{
//                         method : "POST",
//                         headers : {
//                             "Content-Type" : "application/json"
//                         },
//                         body : JSON.stringify({
//                             email : credentials?.email,
//                             password : credentials?.password
//                         })
//                     })

//                     if(!res.ok){
//                         const errorData = await res.json();
//                         throw new Error(errorData.message || "Invalid credentials")
//                     }
//                     const data = await res.json();
//                     console.log({data})

//                     if (!data.token) {
//                         throw new Error("Invalid user data received");
//                       }
            
//                       const jwtToken = data.token;
            
//                       const userResponse = await fetch(
//                         `${process.env.BACKEND_URL}/api/auth/user`,
//                         {
//                           headers: {
//                             Authorization: `Bearer ${jwtToken}`,
//                             "Content-Type": "application/json",
//                             Accept: "application/json",
//                           },
//                         }
//                       );
//                       const userData = await userResponse.json();
            
//                       const user = userData.user;
//                       console.log(user);
            
//                       const { id, name, email } = user ?? {};
//                       return {
//                         id: id,
//                         email: email,
//                         name: name,
//                       };

//                 } catch (error) {
//                     if(error instanceof Error){
//                         console.log("Authcntication error", error)
//                 }

//             },
//         }),
//     ],
//     callbacks : {
//         async jwt ({token, user}: {token : JWT, user?: any}) {
//             if(user){
//                 token.id = user.id;
//                 token.name = user.name;
//                 token.email = user.email;
//             }
//             return token;
//         },
//         async session ({session, token}: {session : any, token : JWT}) {
//             if(token){
//                 session.user.id = token.id;
//                 session.user.name = token.name;
//                 session.user.email = token.email;   
//             }
//             return session ;
//         }

//     }
// }