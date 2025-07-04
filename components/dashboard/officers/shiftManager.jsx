'use client'
import { useState, useEffect } from "react";
import { Timestamp } from "firebase/firestore";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { db } from "@/libs/firebase";
import { motion, AnimatePresence } from "framer-motion";
import clsx from "clsx";
import { create } from 'zustand';
import { clientManager, officerManager, shiftManager } from "@/libs/resourceManagement";

// Create Zustand store for shift management
const useShiftStore = create((set) => ({
  shift: {
    client: null,
    officers: [],
    type: '',
    period: '',
    startDate: '',
    endDate: '',
    startTime: '',
    endTime: '',
    status: 'scheduled'
  },
  setClient: (client) => set((state) => ({ 
    shift: { ...state.shift, client } 
  })),
  setOfficers: (officers) => set((state) => ({ 
    shift: { ...state.shift, officers } 
  })),
  setShiftType: (type) => set((state) => ({ 
    shift: { ...state.shift, type } 
  })),
  setShiftPeriod: (period) => set((state) => ({ 
    shift: { ...state.shift, period } 
  })),
  setStartDate: (startDate) => set((state) => ({ 
    shift: { ...state.shift, startDate } 
  })),
  setEndDate: (endDate) => set((state) => ({ 
    shift: { ...state.shift, endDate } 
  })),
  setShiftDetails: ({ startTime, endTime }) => set((state) => ({ 
    shift: { ...state.shift, startTime, endTime } 
  })),
  resetShiftInfo: () => set({ 
    shift: {
      client: null,
      officers: [],
      type: '',
      period: '',
      startDate: '',
      endDate: '',
      startTime: '',
      endTime: '',
      status: 'scheduled'
    }
  })
}));


export default function ShiftManager() {
  // State management
  const {
    setOfficers,
    setClient,
    setShiftType,
    setShiftPeriod,
    setStartDate,
    setEndDate,
    setShiftDetails,
    resetShiftInfo,
    shift
  } = useShiftStore();

  const [clients, setClients] = useState([]);
  const [officers, setOfficersList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [shifts, setShifts] = useState([]);
  const [selectedShift, setSelectedShift] = useState(null);
  const [filter, setFilter] = useState('All');

  // Initialize data
  useEffect(() => {
    const fetchData = async () => {
      const [allClients, allOfficers] = await Promise.all([
        clientManager.getAll(),
        officerManager.getAll()
      ]);
      setClients(allClients);
      console.log("Clients fetched:", allClients);
      setOfficersList(allOfficers);
      console.log("Officers fetched:", allOfficers);
    };
    fetchData();
  }, []);

  // Set default shift times based on type (day/night)
  const handleShiftTypeChange = (type) => {
    setShiftType(type);
    if (type === 'day') {
      setShiftDetails({
        startTime: '06:00',
        endTime: '18:00'
      });
    } else {
      setShiftDetails({
        startTime: '18:00',
        endTime: '06:00'
      });
    }
  };

  // Calculate end date based on period selection
  const handlePeriodChange = (period) => {
  setShiftPeriod(period);
  
  // If no start date is set, don't calculate end date
  if (!shift.startDate) return;
  
  try {
    const start = new Date(shift.startDate);
    let end = new Date(start);

    switch (period) {
      case 'day':
        // No change needed for single day
        break;
      case 'week':
        end.setDate(end.getDate() + 6);
        break;
      case 'month':
        end.setMonth(end.getMonth() + 1);
        end.setDate(end.getDate() - 1);
        break;
    }

    // Format the date as YYYY-MM-DD without timezone issues
    const formattedEndDate = end.toISOString().split('T')[0];
    setEndDate(formattedEndDate);
  } catch (error) {
    console.error("Error calculating end date:", error);
    // Fallback to the start date if calculation fails
    setEndDate(shift.startDate);
  }
};

  // Submit shift to Firestore
  const handleSubmit = async () => {
    try {
      setLoading(true);
      
      const shiftData = {
        client: {
          id: shift?.client?.id,
          name: `${shift?.client?.first_name} ${shift?.client?.last_name || shift?.client?.company_name}`,
          location: shift?.client?.location
        },
        officers: shift?.officers?.map(officer => ({
          id: officer?.id,
          name: `${officer?.firstName} ${officer?.lastName}`,
          area: officer?.assignedArea
        })),
        type: shift?.type,
        period: shift?.period,
        startDate: shift?.startDate,
        endDate: shift?.endDate,
        startTime: shift?.startTime,
        endTime: shift?.endTime,
        status: 'scheduled',
        createdAt: Timestamp.now()
      };

      await shiftManager.addResource(shiftData);
      alert("Shift created successfully!");
      resetShiftInfo();
    } catch (error) {
      console.error("Error creating shift:", error);
      alert("Failed to create shift");
    } finally {
      setLoading(false);
    }
  };

  // Fetch shifts from Firestore
  useEffect(() => {
    const q = query(collection(db, "shifts"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(q, (snapshot) => {
      const fetchedShifts = snapshot.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data(),
        startDate: doc.data().startDate?.toDate?.() || doc.data().startDate,
        endDate: doc.data().endDate?.toDate?.() || doc.data().endDate
      }));
      setShifts(fetchedShifts);
    });
    return () => unsub();
  }, []);

  // Helper functions
  const getShiftStatus = (shift) => {
    const now = new Date();
    const start = new Date(shift?.startDate);
    const end = new Date(shift?.endDate);

    const [startHour] = shift?.startTime.split(':').map(Number);
    const [endHour] = shift?.endTime.split(':').map(Number);

    start.setHours(startHour);
    end.setHours(endHour);

    if (now < start) return 'Scheduled';
    if (now >= start && now <= end) return 'Active';
    return 'Completed';
  };

  const filteredShifts = shifts.filter(shift => {
    const status = getShiftStatus(shift);
    return filter === 'All' || status === filter;
  });

  return (
    <div className="grid grid-cols-12 gap-4 p-4 bg-gray-50">
      {/* Shift Creation Form */}
      <div className="lg:col-span-8 col-span-12 bg-white p-6 rounded-lg shadow">
        <h1 className="text-2xl font-bold mb-6">Create New Shift</h1>

        {/* Shift Type Selection */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-2">Shift Type</h2>
          <div className="flex gap-4">
            <button
              onClick={() => handleShiftTypeChange('day')}
              className={clsx(
                "px-4 py-2 rounded border",
                shift?.type === 'day' ? "bg-blue-100 border-blue-500" : "bg-gray-100"
              )}
            >
              Day Shift (6:00 AM - 6:00 PM)
            </button>
            <button
              onClick={() => handleShiftTypeChange('night')}
              className={clsx(
                "px-4 py-2 rounded border",
                shift?.type === 'night' ? "bg-blue-100 border-blue-500" : "bg-gray-100"
              )}
            >
              Night Shift (6:00 PM - 6:00 AM)
            </button>
          </div>
        </div>

        {/* Client Selection */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-2">Client Location</h2>
          <select
            onChange={(e) => {
              const clientId = e.target.value;
              const client = clients.find(c => c.id === clientId);
              if (client) setClient(client);
            }}
            className="w-full p-2 border rounded"
          >
            <option value="">Select Client Location</option>
            {clients.map(client => (
              <option key={client?.id} value={client?.id}>
                {client?.clientType === 'individual' ? `${client?.first_name} ${client?.last_name} (${client?.clientType})` : `${client?.company_name} (${client?.clientType})`} - {client?.client_address}
              </option>
            ))}
          </select>
          {shift?.client && (
            <div className="mt-2 p-2 bg-blue-100 rounded">
              <p className="font-medium">Selected Location:</p>
              <p>{shift.client?.client_address}</p>
              {shift?.client?.location && (
                <p className="text-sm text-gray-600">
                  Coordinates: {shift.client?.location?.lat}, {shift.client?.location?.lng}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Officer Selection with Area Assignment */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-2">Assign Officers</h2>
          <select
            onChange={(e) => {
              const officerId = e.target.value;
              const officer = officers?.find(o => o.id === officerId);
              if (officer) {
                const area = prompt(`Enter guard area for ${officer?.first_name} ${officer?.last_name}:`);
                if (area) {
                  setOfficers([...shift?.officers, { ...officer, assignedArea: area }]);
                }
              }
            }}
            className="w-full p-2 border rounded mb-2"
          >
            <option value="">Select Officer</option>
            {officers?.map(officer => (
              <option key={officer?.id} value={officer?.id}>
                {officer?.firstName} {officer?.lastName} - ({officer?.department})
              </option>
            ))}
          </select>
          
          {shift?.officers?.length > 0 && (
            <div className="mt-2 border rounded divide-y">
              {shift?.officers?.map((officer, index) => (
                <div key={index} className="p-2 flex justify-between items-center">
                  <div>
                    <p className="font-medium">{officer?.first_name} {officer?.last_name}</p>
                    <p className="text-sm text-gray-600">Area: {officer?.assignedArea}</p>
                  </div>
                  <button
                    onClick={() => setOfficers(shift?.officers?.filter((_, i) => i !== index))}
                    className="text-red-500"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Shift Period Selection */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-2">Shift Period</h2>
          <div className="flex gap-4">
            {['day', 'week', 'month'].map(period => (
              <button
                key={period}
                onClick={() => handlePeriodChange(period)}
                className={clsx(
                  "px-4 py-2 rounded capitalize",
                  shift?.period === period ? "bg-blue-100 border border-blue-500" : "bg-gray-100"
                )}
              >
                {period}
              </button>
            ))}
          </div>
        </div>


        {/* Date Selection */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium mb-1">Start Date</label>
            <input
              type="date"
              value={shift.startDate || ''}
              onChange={(e) => {
                if (e.target.value) {
                  setStartDate(e.target.value);
                  // Recalculate end date if period is already set
                  if (shift.period) handlePeriodChange(shift.period);
                }
              }}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">End Date</label>
            <input
              type="date"
              value={shift.endDate || ''}
              onChange={(e) => e.target.value && setEndDate(e.target.value)}
              className="w-full p-2 border rounded"
              min={shift.startDate}
            />
          </div>
        </div>

        {/* Time Display */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium mb-1">Start Time</label>
            <input
              type="text"
              value={shift?.startTime}
              readOnly
              className="w-full p-2 border rounded bg-gray-100"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">End Time</label>
            <input
              type="text"
              value={shift?.endTime}
              readOnly
              className="w-full p-2 border rounded bg-gray-100"
            />
          </div>
        </div>

        <button
          onClick={handleSubmit}
          disabled={loading || !shift?.client || shift?.officers?.length === 0}
          className="w-full py-3 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400"
        >
          {loading ? "Creating shift?..." : "Create Shift"}
        </button>
      </div>

      {/* Shifts List */}
      <div className="lg:col-span-4 col-span-12 bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-bold mb-4">Scheduled Shifts</h2>
        
        {/* Filter Buttons */}
        <div className="flex gap-2 mb-4">
          {['All', 'Scheduled', 'Active', 'Completed'].map(status => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={clsx(
                "px-3 py-1 rounded text-sm",
                filter === status ? "bg-green-600 text-white" : "bg-gray-100"
              )}
            >
              {status}
            </button>
          ))}
        </div>

        {filteredShifts.length === 0 ? (
          <p className="text-gray-500">No shifts found</p>
        ) : (
          <div className="space-y-3">
            {filteredShifts.map(shift => (
              <div
                key={shift?.id}
                onClick={() => setSelectedShift(shift)}
                className="p-3 border rounded cursor-pointer hover:bg-blue-50"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium">{shift?.client?.name}</p>
                    <p className="text-sm text-gray-600">
                      {new Date(shift?.startDate).toLocaleDateString()} - {new Date(shift?.endDate).toLocaleDateString()}
                    </p>
                  </div>
                  <span className={clsx(
                    "px-2 py-1 rounded text-xs",
                    getShiftStatus(shift) === 'Scheduled' && "bg-yellow-100 text-yellow-800",
                    getShiftStatus(shift) === 'Active' && "bg-blue-100 text-blue-800",
                    getShiftStatus(shift) === 'Completed' && "bg-green-100 text-green-800"
                  )}>
                    {getShiftStatus(shift)}
                  </span>
                </div>
                <p className="text-sm mt-1">
                  {shift?.type === 'day' ? 'Day' : 'Night'} Shift ({shift?.startTime} - {shift?.endTime})
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Shift Detail Modal */}
      <AnimatePresence>
        {selectedShift && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            onClick={() => setSelectedShift(null)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl font-bold mb-4">Shift Details</h3>
              
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-500">Client</p>
                  <p className="font-medium">{selectedShift?.client?.name}</p>
                  <p className="text-sm">{selectedShift?.client?.location?.address}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">Shift Period</p>
                  <p className="font-medium capitalize">{selectedShift?.period}</p>
                  <p className="text-sm">
                    {new Date(selectedShift?.startDate).toLocaleDateString()} - {new Date(selectedShift?.endDate).toLocaleDateString()}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">Shift Type</p>
                  <p className="font-medium capitalize">
                    {selectedShift?.type} Shift ({selectedShift?.startTime} - {selectedShift?.endTime})
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">Assigned Officers</p>
                  <div className="mt-1 space-y-2">
                    {selectedShift?.officers?.map((officer, index) => (
                      <div key={index} className="p-2 bg-gray-50 rounded">
                        <p className="font-medium">{officer?.name}</p>
                        <p className="text-sm">Area: {officer?.area}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <p className={clsx(
                    "font-medium inline-block px-2 py-1 rounded",
                    getShiftStatus(selectedShift) === 'Scheduled' && "bg-yellow-100 text-yellow-800",
                    getShiftStatus(selectedShift) === 'Active' && "bg-blue-100 text-blue-800",
                    getShiftStatus(selectedShift) === 'Completed' && "bg-green-100 text-green-800"
                  )}>
                    {getShiftStatus(selectedShift)}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedShift(null)}
                className="mt-6 w-full py-2 bg-gray-200 rounded hover:bg-gray-300"
              >
                Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}