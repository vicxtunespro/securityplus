"use client"
import clsx from "clsx";
import { Menu, Minimize, ShieldEllipsis, Users, Shield, FileText, Settings, LogOut, Home } from "lucide-react";
import { useState } from "react"
import { SearchBar } from "./search-bar";
import NavItem from "./nav-item";



export default function SideBar(){
    const [min, setMin] = useState(false);

    const maximise = () =>{
        setMin(false);
    }

    const minimise = () =>{
        setMin(true);
    }

    const toggleMenu = () => {
        setMin(!min)
    }

    return(
    <div className={
        clsx(
            "fixed z-20 md:relative h-screen bg-sky-800 text-white p-4 flex flex-col gap-8 relative",
            min ? " w-16 transition-all ease-in-out " : "w-[280px] max-w-[280px]"
        )
    }
    >
        <div className={clsx(
            "flex justify-between",
            min ? "flex-col " : ""
        )}>
            <span className="flex justify-center items-center gap-4">
                    <ShieldEllipsis size={24}/>
                    <span className={clsx(
                        "text-white font-black text-xs",
                        min ? "hidden" : "visible" 
                    )}>SECURITY PLUS</span>
            </span>
            <span className={clsx(
                "",
                min ? "hidden" : "block"
            )}><Minimize onClick={minimise}/></span>
        </div>
        <SearchBar min={min}/>
        <div className="flex flex-col gap-2">
            <NavItem icon={Home} label="Dashboard" min={min} Maximise={maximise} />
            <NavItem icon={Users} label="Client Management" min={min} Maximise={maximise} />
            <NavItem icon={Shield} label="Officer Management" min={min} Maximise={maximise} />
            <NavItem icon={FileText} label="Reports & Analysis" min={min} Maximise={maximise} />
        </div>
        <div className="mt-40 flexx flex-col gap-2">
            <NavItem icon={Settings} label="Settings" min={min} Maximise={maximise} />
            <NavItem icon={LogOut} label="Logout" min={min} Maximise={maximise} />
        </div>
    </div>
    )
}