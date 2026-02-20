'use client'
import { signOut, useSession } from "next-auth/react";
import Button from "../Home/Button";
const Nav = () => {
  const session=useSession()
  console.log(session)
  return (
    <div className="w-full flex justify-between items-center bg-white text-zinc-600 p-2">
      <span>Trendly</span>
      <span></span>
      <Button
        callback={()=>signOut()}
        className="ring-1-black/10 shadow-sm px-2 py-1 rounded-sm"
        label={`SignOut`}
      ></Button>
    </div>
  );
};

export default Nav;
