import { options } from "@/lib/options";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { features } from "@/constants/features";
import FeaturesTabs from "../_components/Home/Features_tab";

export default async function Home() {
  const session = await getServerSession(options);
  if (!session?.user) return (
    <main className=" h-full w-screen font-serif bg-radial-[at_25%_25%] from-white to-zinc-900 to-75%">
      <header className="flex justify-end ">
        <Button className="bg-black text-white rounded-none mx-3 mt-4">Join Now</Button>
      </header>
      <main className="flex flex-col mt-[10%] justify-center items-center">
        {/* title card */}
        <div className="flex flex-col justify-center items-center">
          <span className="text-5xl md:text-[20rem] ">Trendly</span>
          <Link href={'/signin'}>
            <Button className="text-2xl shadow-xl rounded-xl ring-1 ring-black/10 px-2 py-4 text-white"
            >Sign Up Now
            </Button>
          </Link>
        </div>

        {/* cards */}

        <div className="w-screen flex justify-center items-center">
         <FeaturesTabs/>
        </div>
      </main>
      <footer></footer>
    </main>
  );
  else redirect('/dashboard')
}
