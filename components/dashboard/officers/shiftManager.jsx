'use client'
import clsx from "clsx";
import { Shield } from "lucide-react";
import { useEffect, useState } from "react";
import useShiftStore from "@/store/shiftStore";
import { clientManager, officerManager, shiftManager } from "@/libs/resourceManagement";
import { serverTimestamp } from "firebase/firestore";

export default function ShiftManager(){

    const {setOfficersID, setClientID, setShiftType, setStartDate, setEndDate, setStartTime, setEndTime, shift, setRepeatedDays, resetShiftInfo, officersID, clientID, shiftType, startDate, startTime,  endTime, endDate, repeatedDays} = useShiftStore();

    const [clients, setClients] = useState([]);
    const [officersInfo, setOfficersInfo] = useState([]);
    const [selectedDays, setSelectedDays] = useState([]);
    const [selectedOfficers, setSelectedOfficers] = useState([]);
    const [selectedOfficer, setSelectedOfficer] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleOfficerSelection = (event) => {
        const selectedOfficerId = event.target.value;
        setSelectedOfficer(selectedOfficerId);
    
        setSelectedOfficers((prev) => {
            if(prev.includes(selectedOfficerId)){
                return prev.filter((id) => id !== selectedOfficerId) // Remove if already selected
            }else{
                const newList = [...prev, selectedOfficerId] // Add if not selected
                return newList;
            }
    });

    console.log(selectedOfficers);
    };
    

    const checkSelect = (day) => {
        if(selectedDays.includes(day)){
            return true;
        }else{
            return false;
        }
    }
    
    const handleShiftType = (e) => {
        setShiftType(e.target.value);
    }

    const handleSelectedDays = (day) =>{
        setSelectedDays((prevSelectedDays) => {
            if (prevSelectedDays.includes(day)) {
                // If day already exists, remove it
                return prevSelectedDays.filter((selectedDay) => selectedDay !== day);
            } else {

                // If day doesn't exist, add it
                const updatedDays = [...prevSelectedDays, day];
                // setRepeatedDays(updatedDays);
                return  updatedDays;   
            }
        });
    }

    useEffect(()=> {
        async function updateStore(){
            setRepeatedDays(selectedDays);
            setOfficersID(selectedOfficers);
        }

        updateStore()
        
    }, [selectedDays, selectedOfficers])
    
    const handleSubmit = async (e) => {
        
        try {

            setLoading(true);

            const shiftData = {
                officersID: officersID,
                clientID: clientID,
                shiftType: shiftType,
                startTime: startTime,
                endTime: endTime,
                startDate: startDate,
                endDate: endDate,
                repeatedDays: repeatedDays,
                createdAt: serverTimestamp(),
            }

            console.log(shiftData);
            //console.log(useShiftStore(state).state)

            await shiftManager.addResource(shiftData);
            alert("Shift added successfully!");

        } catch (error) {
            console.log(error);
        } finally {
            resetShiftInfo();
            setLoading(false);
            window.location.reload(); 
        }
    }

    useEffect(() => {
        const fetchData = async() =>{
            // Fetch user and officer data from firestore.
            const clients = await clientManager.getAll();
            const officers = await officerManager.getAll();

            // Updating User state to new clients list
            setClients(clients);
            console.log(clients);

            // Updating Officers state to new officers list
            setOfficersInfo(officers);
            console.log(officers);
        }

        fetchData();
    }, [])

    // Days of the week
    const Days = ['Monday', 'Tueday', 'Wednesday', 'Thurday', 'Friday', 'Saturday', 'Sunday'];

    return (
        <div className="grid grid-cols-12 gap-2 bg-['#f2f2f2'] w-full h-screen">
            <div className="lg:col-span-8 col-span-12 shadow-lg h-fit bg-white p-4 border-t-2 border-blue-500 flex flex-col gap-4">
                {/* Header section */}
                <div className="modal-header-section flex flex-col gap-2">
                    <h1 className="md:text-xl lg:text-2xl font-bold md:font-bold">
                    Shift Scheduling form
                    </h1>
                    <p className="text-xs font-light text-slate-500">
                    All officer shift changes must be communicated and approved.
                    </p>
                </div>

                {/* Participate section */}
                <div className="flex gap-4 flex-col">

                    <div className="flex flex-col gap-2">
                        <h2 className="text-lg font-semibold">Selected Officers</h2>
                        {selectedOfficers.length > 0 ? (
                            <ul className="list-disc pl-5">
                                {selectedOfficers.map((officerId) => {
                                    const officer = officersInfo.find(o => o.id === officerId);
                                    return officer ? (
                                        <li key={officerId} className="text-sm">
                                            {officer.first_name} {officer.last_name}
                                        </li>
                                    ) : null;
                                })}
                            </ul>
                        ) : (
                            <p className="text-gray-500 text-sm">No officers selected.</p>
                        )}
                    </div>
                    
                    <div className="relative inline-block w-full text-gray-700">
                        <select 
                        onChange={handleOfficerSelection}
                        className="block appearance-none w-full bg-white border border-gray-300 rounded-md py-2 px-4 pr-8 leading-tight focus:outline-none focus:bg-white focus:border-blue-500">
                            <option value="">Select Security Guard</option>
                            {officersInfo.map((officer) => (
                                <option 
                                    key={officer.id}
                                    value={officer.id}>{`${officer.first_name} ${officer.last_name}`}
                                </option>
                            ))}
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                            <svg className="fill-current h-4 w-4" viewBox="0 0 20 20"><path d="M5.5 8l4.5 4.5L14.5 8z"/></svg>
                        </div>
                    </div>
                    <div className="relative inline-block w-full text-gray-700">
                        <select 
                        onChange={(e) => setClientID(e.target.value)}
                        className="block appearance-none w-full bg-white border border-gray-300 rounded-md py-2 px-4 pr-8 leading-tight focus:outline-none focus:bg-white focus:border-blue-500">
                            <option value="" > Attach Client to Security Guard</option>
                            {clients.map((client) => (
                                <option key={client.id} value={client.id}>{client.name}</option>
                            ))}
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                            <svg className="fill-current h-4 w-4" viewBox="0 0 20 20"><path d="M5.5 8l4.5 4.5L14.5 8z"/></svg>
                        </div>
                    </div> 
                </div>

                {/* Time alloction section */}
                <div className="relative inline-block w-full text-gray-700">
                    {/* Shift type selector */}
                    <select onChange={handleShiftType} className="block appearance-none w-full bg-white border border-gray-300 rounded-md py-2 px-4 pr-8 leading-tight focus:outline-none focus:bg-white focus:border-blue-500">
                        <option value="">Choose Shift type</option>
                        <option value="one time">One-time shift</option>
                        <option value="Repeated">Repeated</option>
                        <option value="daily">Daily</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                        <svg className="fill-current h-4 w-4" viewBox="0 0 20 20"><path d="M5.5 8l4.5 4.5L14.5 8z"/></svg>
                    </div>
                </div>
                {/* End Shift type */}

            {/* Days check boxes for repeated shift */}
            {shiftType === "Repeated" && 
            <div className="flex flex-col space-y-2 mt-4">
                    <h2 className="text-lg font-semibold mb-2">Select Days to Repeat</h2>    
                    <div className="flex w-full flex-wrap gap-2">
                        {
                            Days.map((day, index) => (
                                <div className="flex items-center" key={index}>
                                    <button 
                                    onClick={() => handleSelectedDays(day)}
                                    className={clsx("px-2 py-2 text-xs flex items-center justify-center cursor-pointer border border-gray-300 rounded-md shadow-sm hover:bg-gray-100 transition", 
                                        checkSelect(day) ? 'bg-main text-background' : ''
                                    )}>
                                        <span className="mr-2">{day}</span>
                                    </button>
                                </div>
                            ))
                        }
                    </div>
            </div>}
            {/* End of check boxes */}

                <div className="w-full p-2 border-b-slate-400 mb-2 font-blod">Allocate time</div>
                {/* Date pickers */}
                <div className="flex gap-4">
                    <div className="border-slate-100 border w-fit rounded-md overflow-hidden pl-4 flex gap-2 items-center">
                        <label htmlFor="start-date" className="font-medium text-sm">Start Date</label>
                        <input 
                            onChange={(e) => setStartDate(e.target.value)}
                            type="date" 
                            placeholder="-- : --" 
                            className="bg-slate-100 rounded w-24 p-2 focus:outline-0 appearance-none" 
                        />
                    </div>
                    <div className="border-slate-100 border w-fit rounded-md overflow-hidden pl-4 flex gap-2 items-center">
                        <label htmlFor="start-time" className="font-medium text-sm">Stop Date</label>
                        <input 
                            onChange={(e) => setEndDate(e.target.value)}
                            type="date" placeholder="-- : --" 
                            className="bg-slate-100 rounded w-24 p-2 focus:outline-0 appearance-none" 
                        />
                    </div>
                </div>
                {/* End of datepickers */}

                {/* Timer Pickers */}
                <div className="flex gap-4">
                    <div className="border-slate-100 border w-fit rounded-md overflow-hidden pl-4 flex gap-2 items-center">
                        <label htmlFor="start-time" className="font-medium text-sm">Start Time</label>
                        <input 
                            onChange={(e) => setStartTime(e.target.value)}
                            type="time" placeholder="-- : --" className="bg-slate-100 rounded w-24 p-2 focus:outline-0 appearance-none" />
                    </div>
                    <div className="border-slate-100 border w-fit rounded-md overflow-hidden pl-4 flex gap-2 items-center">
                        <label htmlFor="start-time" className="font-medium text-sm">Start Time</label>
                        <input 
                            onChange={(e) => setEndTime(e.target.value)}
                            type="time" placeholder="-- : --" className="bg-slate-100 rounded w-24 p-2 focus:outline-0 appearance-none" />
                    </div>
                </div>
                {/* End of time pickers */}

                <button onClick={handleSubmit} className="py-2 px-4 w-full bg-main rounded text-white">{loading ? "loading ..." : "Submit Shift" }</button>
            </div>
        </div>
    )
}