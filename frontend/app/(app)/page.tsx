import { options } from "@/lib/options";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function Home() {
  const session=await getServerSession(options);
  if(!session?.user)return (
    <>
    landing page
    </>
  );
  else redirect('/dashboard')
}
