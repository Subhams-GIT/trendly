import { options } from "@/lib/options";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function Home() {
  const session=await getServerSession(options);
  if(!session?.user)return (
    <>
    <div className="flex w-full p-2 py-1 justify-between items-center ">
      <span>Trendly</span>
      <Link href="/auth/signin">
        <button>Sign In</button>
      </Link>
    </div>
    <span>home</span>
    </>
  );
  else redirect('/dashboard')
}
