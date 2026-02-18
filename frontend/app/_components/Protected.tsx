
import { useSession } from "next-auth/react"
import { redirect } from "next/navigation"
import React from "react";

export default function Auth({children}:{children:React.ReactNode}) {
  const { status } = useSession({
    required: true,
    onUnauthenticated() {
        redirect('/auth/signin');
    },
  })
  
  if (status === "loading") {
    return "Loading or not authenticated..."
  }

  return children
}