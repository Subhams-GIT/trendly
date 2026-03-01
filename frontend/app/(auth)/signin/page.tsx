'use client'
import { signIn } from "next-auth/react";
import googlesvg from "../../../public/google.svg"
import Image from "next/image";
const page = () => {
  return < div className="w-full h-screen bg-white flex justify-center items-center ">
    <button className=" flex justify-center items-center gap-3 bg-blue px-2 py-1 rounded-md shadow-sm ring-1-black/100 self-center"
    onClick={()=>signIn("google",{callbackUrl:"/dashboard"})}
    ><Image src={googlesvg} height={30} width={30} alt="google"/> google sign in</button>
  </div>;
};

export default page;
