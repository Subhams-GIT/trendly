import { options } from "@/lib/options";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function Home() {
  const session = await getServerSession(options);
  if (!session?.user) return (
    <main>
      <header>
        
      </header>
      {/* main tag for the hero section */}
      <main>

      </main>
      {/* footer tag */}
      <footer></footer>
    </main>
  );
  else redirect('/dashboard')
}
