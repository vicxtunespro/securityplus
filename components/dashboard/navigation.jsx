"use client"
import clsx from "clsx";
import { Menu, Minimize, ShieldEllipsis, Users, Shield, FileText, Settings, LogOut, Home } from "lucide-react";
import useNavStore from "@/store/navStore";
import { SearchBar } from "./search-bar";
import NavItem from "./nav-item";



export default function SideBar(){
    const {min, minimize, maximize, toggleMenu} = useNavStore();

    return(
    <div className={
        clsx(
            "hidden md:relative h-screen bg-sky-800 text-white p-4 md:flex flex-col gap-8",
            min ? " w-16 transition-all ease-in-out " : "min-w-[260px]"
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
            )}><Minimize onClick={minimize}/></span>
        </div>
        <SearchBar min={min}/>
        <div className="flex flex-col gap-2">
            <NavItem icon={Home} label="Dashboard" url={'/dashboard'}/>
            <NavItem icon={Users} label="Client Management" url={'/dashboard/clients'}/>
            <NavItem icon={Shield} label="Officer Management" url={'/dashboard/officers'}/>
            <NavItem icon={FileText} label="Reports & Analysis" url={'/dashboard/analysis'}/>
        </div>
        <div className="mt-40 flexx flex-col gap-2">
            <NavItem icon={Settings} label="Settings" min={min} maximize={maximize} />
            <NavItem icon={LogOut} label="Logout" min={min} maximize={maximize} />
        </div>
    </div>
    )
}