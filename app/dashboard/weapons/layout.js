'use client';
import React from "react";
import { usePathname } from "next/navigation"; // Import usePathname
import useModalStore from "@/store/modalStore";
import AddWeaponModal from "@/components/Data Models/addWeapon";
import Modal from "@/components/Data Models/modal"; // Ensure this is imported
import { Filter, Plus } from "lucide-react";

export default function WeaponSectionHeader({ children }) {
  const { openModal } = useModalStore();
  const pathname = usePathname(); // Get the current path

  const handleOpenModal = () => {
    openModal(<AddWeaponModal />);
  };

  const navigation = [
    { href: "/dashboard/weapons/inventory", name: "Inventory" },
    { href: "/dashboard/weapons/issued", name: "Issued Weapons" },
    { href: "/dashboard/weapons/dashboard", name: "Dashboard" },
  ];

  return (
    <div className="max-w-screen-xl mx-auto px-4 pt-4 md:px-8">
      <div className="items-start justify-between flex">
        <h3 className="text-gray-800 text-2xl font-bold">Weapons</h3>
        <div className="items-center gap-x-3 mt-6 md:mt-0 justify-center hidden md:flex">
          <button className="flex items-center justify-center gap-x-2 px-4 py-2 text-gray-700 font-medium rounded-lg border hover:bg-gray-50 active:bg-gray-100 md:text-sm">
            <Filter className="w-5 h-5 text-gray-500" />
            Filter
          </button>
          <button
            onClick={handleOpenModal}
            className="px-4 py-2 mt-3 text-white font-medium bg-main rounded-lg hover:bg-indigo-500 active:bg-indigo-700 sm:mt-0 md:text-sm"
          >
            New Weapon
          </button>
        </div>
        <div className="items-center gap-x-3 md:mt-0 flex md:hidden justify-center">
          <span className="p-2 bg-slate-200 text-slate-800 rounded-full">
            <Filter />
          </span>
          <span
            onClick={handleOpenModal}
            className="p-2 bg-slate-200 text-slate-800 rounded-full"
          >
            <Plus />
          </span>
        </div>
      </div>

      <div className="mt-6 md:mt-4">
        <ul className="w-full border-b flex items-center gap-x-3 overflow-x-auto">
          {navigation.map((item, idx) => (
            <li
              key={idx}
              className={`py-2 border-b-2 ${
                pathname === item.href
                  ? "border-blue-500 text-blue-500"
                  : "border-white text-gray-500"
              }`}
            >
              <a
                href={item.href}
                className="py-2.5 px-4 rounded-lg duration-150 text-sm hover:text-blue-500 hover:bg-gray-50 active:bg-gray-100 font-medium"
              >
                {item.name}
              </a>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-4">{children}</div>

      {/* Modal Component */}
      <Modal />
    </div>
  );
}
