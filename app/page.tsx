import Image from "next/image";
// import {getServerSession} from "next-auth"
// import { authOptions } from "./api/auth/[...nextauth]/route";
"use client"
import { useSession } from "next-auth/react";
export default  function Home() {
  //const data = await getServerSession(authOptions);
  const {data,status} = useSession();
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1>Hello World</h1>

      <div>{JSON.stringify(data)}</div>
      <div>{status}</div>
    </main>
  );
}
