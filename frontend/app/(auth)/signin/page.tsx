'use client'
import { signIn } from "next-auth/react";

const page = () => {
  return <div className="w-full h-screen bg-white flex justify-center items-center ">
    <button className="bg-blue px-2 py-1 rounded-md shadow-sm ring-1-black/100 text-neutral-500"
    onClick={()=>signIn("google",{callbackUrl:"/dashboard"})}
    >google sign in</button>
  </div>;
};

export default page;
