import clsx from "clsx";
import React from "react";


const NavItem = ({ icon: Icon, label, min, Maximise}) => {
  return (
    <li 
    className="text-white w-full flex items-center gap-4 p-2 rounded-lg text-sm font-medium cursor-pointer hover:bg-slate-300 hover:font-semibold hover:bg-opacity-30 transition-all ease-in-out"
    onClick= {Maximise}
    >
      <Icon size={20}/>
      <span className={clsx(min ? "hidden" : "visible")}>
        {label}
      </span>
    </li>
  );
};

export default NavItem;
