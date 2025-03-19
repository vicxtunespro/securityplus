"use client";
import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs, addDoc } from "firebase/firestore";


export default function ManageShifts() {
  const [officers, setOfficers] = useState([]);
  const [shifts, setShifts] = useState([]);
  const [selectedOfficer, setSelectedOfficer] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const officerSnapshot = await getDocs(collection(db, "users"));
      const shiftSnapshot = await getDocs(collection(db, "shifts"));
      setOfficers(officerSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setShifts(shiftSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };
    fetchData();
  }, []);

  const handleAssignShift = async () => {
    if (!selectedOfficer || !date || !time) return;
    const shiftData = { officerId: selectedOfficer, date, time };
    await addDoc(collection(db, "shifts"), shiftData);
    setShifts([...shifts, shiftData]);
    setSelectedOfficer("");
    setDate("");
    setTime("");
  };

  return (
    <div>
    <h1 className="text-2xl font-bold mb-4">Manage Shifts</h1>
    
    {/* Assign Shift Form */}
    <div className="mb-6 bg-white p-4 rounded shadow">
        <h2 className="text-xl font-semibold">Assign Shift</h2>
        <div className="grid grid-cols-3 gap-4 mt-3">
        <select
            className="border p-2 rounded"
            value={selectedOfficer}
            onChange={(e) => setSelectedOfficer(e.target.value)}
        >
            <option value="">Select Officer</option>
            {officers.map(officer => (
            <option key={officer.id} value={officer.id}>{officer.name}</option>
            ))}
        </select>
        <input type="date" className="border p-2 rounded" value={date} onChange={(e) => setDate(e.target.value)} />
        <input type="text" className="border p-2 rounded" placeholder="08:00 - 16:00" value={time} onChange={(e) => setTime(e.target.value)} />
        <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={handleAssignShift}>Assign</button>
        </div>
    </div>

    {/* Shift List */}
    <div className="bg-white p-4 rounded shadow">
        <h2 className="text-xl font-semibold">Shift Schedule</h2>
        <table className="w-full mt-3">
        <thead>
            <tr className="bg-gray-200">
            <th className="p-2">Officer</th>
            <th className="p-2">Date</th>
            <th className="p-2">Time</th>
            </tr>
        </thead>
        <tbody>
            {shifts.map((shift, index) => (
            <tr key={index} className="border-b">
                <td className="p-2">{officers.find(o => o.id === shift.officerId)?.name || "Unknown"}</td>
                <td className="p-2">{shift.date}</td>
                <td className="p-2">{shift.time}</td>
            </tr>
            ))}
        </tbody>
        </table>
    </div>
    </div>
  );
}
