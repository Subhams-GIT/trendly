"use client"
import { useState } from "react"
import { main } from "@/types/interface_types";
const page = () => {
    const [selected,setselected]=useState<main>('survey');
  return (
    <div className="w-full h-full flex justify-center items-center">
        <header>
            <h1 className="text-5xl">Create {selected}</h1>
            <h4>{selected=="survey"?"Comprehensive survey with multiple questions and options":"Quick poll to gather immediate feedback"}</h4>

        </header>
        <main>

        </main>
    </div>
  )
}

export default page
