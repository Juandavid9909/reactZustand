import { StateCreator } from 'zustand';

export interface DateSlice {
    eventDate: Date;
    eventYYYYMMDD: () => string;
    eventHHMM: () => string;
    setEventDate: (partialDate: string) => void;
}

export const createDateSlice: StateCreator<DateSlice> = (set, get) => ({
    eventDate: new Date(),
    eventYYYYMMDD: () => {
        return get().eventDate.toISOString().split('T')[0];
    },
    eventHHMM: () => {
        const hours = get().eventDate.getHours().toString().padStart(2, '0');
        const minutes = get().eventDate.getMinutes().toString().padStart(2, '0');

        return `${ hours }:${ minutes }`;
    },
    setEventDate: (partialDate: string) => set((state) => {
        const date = new Date(partialDate);

        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const day = date.getDate();

        const newDate = new Date(state.eventDate);
        newDate.setFullYear(year, month, day);

        return {
            eventDate: newDate,
        };
    }),
});