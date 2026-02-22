'use client'
import { signIn, signOut, useSession } from "next-auth/react";
import Button from "../Home/Button";
const Nav = () => {
  const {data:session}=useSession()
  const user=session?.user;
  return (
    <div className="w-full flex justify-between items-center bg-white text-zinc-600 p-2">
      <span>Trendly</span>
      <span></span>
      {
        user?(<>
         <Button
        callback={()=>signOut()}
        className="ring-1-black/10 shadow-sm px-2 py-1 rounded-sm hover::pointer"
        label={`SignOut`}
      ></Button></>):(<> <Button
        callback={()=>signIn()}
        className="ring-1-black/10 shadow-sm px-2 py-1 rounded-sm"
        label={`SignIn`}
      ></Button></>)
      }

    </div>
  );
};

export default Nav;
