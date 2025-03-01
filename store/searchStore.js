import { create } from 'zustand'

const useSearch = create((set) => ({
    officerSearch: '',
    setOfficerSearch: (keyword) => set({ officerSearch: keyword}),
}))