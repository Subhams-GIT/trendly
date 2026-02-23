'use client'
import { signIn, signOut, useSession } from "next-auth/react";
import Button from "../Home/Button";
const Nav = () => {
  const {data:session}=useSession()
  const user=session?.user;
  console.log(user)
  return (
    <div className="w-full flex justify-between items-center bg-white text-zinc-600 p-2">
      <span>Trendly</span>
      <span></span>
      {
        user?(<>
         <Button
        callback={()=>signOut({callbackUrl:"/"})}
        className="ring-1-black/10 shadow-sm px-2 py-1 rounded-sm cursor-pointer"
        label={`SignOut`}
      ></Button></>):(<> <Button
        callback={()=>signIn()}
        className="ring-1-black/10 shadow-sm px-2 py-1 rounded-sm cursor-pointer"
        label={`SignIn`}
      ></Button></>)
      }

    </div>
  );
};

export default Nav;
