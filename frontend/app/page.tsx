import { options } from "@/lib/options";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function Home() {
  const session=await getServerSession(options);
  if(!session?.user) redirect('/auth/signin')
  console.log(session)
  return (
    <>
   <span>home</span>
    </>
  );
}
