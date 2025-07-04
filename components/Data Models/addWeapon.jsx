'use client';
import { useState } from "react";
import { weaponManager } from "@/libs/resourceManagement"; // or wherever your ResourceManager is
import useModalStore from "@/store/modalStore";
import InputField from "./input-field";
import { toast } from "react-toastify"; // Import toast
import "react-toastify/dist/ReactToastify.css"; // Import toast styles

export default function AddWeaponForm({ onClose }) {
    const { closeModal } = useModalStore();

    const [weapon, setWeapon] = useState({
        name: "",
        serial: "",
        type: "",
        quantity: 0,
        status: "available",
    });

    const handleChange = (e) => {
        setWeapon({ ...weapon, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await weaponManager.addResource(weapon);
            alert("✅ Weapon added!");
            if (onClose) onClose();
        } catch (err) {
            console.error("❌ Error adding weapon:", err);
            toast.error("❌ Failed to add weapon."); // Error toast
        } finally {
            closeModal(); // Close the modal after submission
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 p-4">
            {/* Serial number field */}
            <InputField 
                label="Serial Number" 
                type="text" 
                placeholder="As provided by the manufacturer" 
                onChange={(e) => setWeapon({...weapon, serial: e.target.value})} 
                value={weapon.serial} 
                required 
            />

            {/* Name field */}
            <InputField 
                label="Name" 
                type="text" 
                placeholder="As provided by the manufacturer" 
                onChange={(e) => setWeapon({...weapon, name: e.target.value})} 
                value={weapon.name} 
                required 
            />

            {/* Type field */}
            <label className="block text-sm font-medium text-gray-700">Type</label>
            {/* Select field for weapon type */}
            <select 
                name="type" 
                onChange={(e) => setWeapon({...weapon, type: e.target.value})} 
                className="w-full border p-2 rounded"
                value={weapon.type}
            >
                <option value="">Select Type</option>
                <option value="Gun">Gun</option>
                <option value="Handheld Weapon">Handheld Weapon</option>
            </select>

            {/* Quantity Field */}
            <InputField 
                label="Quantity Available" 
                type="number" 
                placeholder="Enter quantity"
                onChange={(e) => setWeapon({...weapon, quantity: e.target.value})} 
                value={weapon.quantity}
                required 
            />
            
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Save</button>
        </form>
    );
}
