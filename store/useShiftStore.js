import create from 'zustand';

export const useShiftStore = create((set) => ({
  client: null,
  officers: [],
  type: 'day',
  period: 'day',
  startDate: new Date().toISOString().split('T')[0],
  endDate: new Date().toISOString().split('T')[0],
  startTime: '06:00',
  endTime: '18:00',
  
  // Actions
  setClient: (client) => set({ client }),
  setOfficers: (officers) => set({ officers }),
  setShiftType: (type) => set({ type }),
  setShiftPeriod: (period) => set({ period }),
  setStartDate: (startDate) => set({ startDate }),
  setEndDate: (endDate) => set({ endDate }),
  setShiftDetails: (details) => set(details),
  resetShiftInfo: () => set({
    client: null,
    officers: [],
    type: 'day',
    period: 'day',
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
    startTime: '06:00',
    endTime: '18:00'
  })
}));