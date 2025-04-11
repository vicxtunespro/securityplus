import { Poppins } from "next/font/google"

import { cn } from "@/libs/utils"

const font = Poppins({
    subsets: ['latin'],
    weight: ['600']
})

export function Header({label}) {
  return (
    <div className="py-2 px-4 flex flex-col">
        <h1 className={cn("text-lx tracking-tight", font.className)}>
            Security Plus 🔐
        </h1>
        <p>{label}</p>
    </div>
  )
}
