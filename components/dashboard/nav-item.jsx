import React from "react";

const NavItem = ({ icon: Icon, label }) => {
  return (
    <li className="text-white text-lg w-full h-[54px] flex items-center pl-[48px] gap-4 text-[14px] font-medium hover:bg-[#3c39db] cursor-pointer">
      <Icon size="20" />
      {label}
    </li>
  );
};

export default NavItem;
