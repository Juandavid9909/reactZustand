import { StateCreator } from 'zustand';

export interface DateSlice {
    eventDate: Date;
    eventHHMM: () => string;
    eventYYYYMMDD: () => string;
    setEventDate: (partialDate: string) => void;
    setEventTime: (eventTime: string) => void;
}

export const createDateSlice: StateCreator<DateSlice> = (set, get) => ({
    eventDate: new Date(),
    eventHHMM: () => {
        const hours = get().eventDate.getHours().toString().padStart(2, '0');
        const minutes = get().eventDate.getMinutes().toString().padStart(2, '0');

        return `${ hours }:${ minutes }`;
    },
    eventYYYYMMDD: () => {
        return get().eventDate.toISOString().split('T')[0];
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
    setEventTime: (eventTime: string) => set((state) => {
        const hours = parseInt(eventTime.split(':')[0]);
        const minutes = parseInt(eventTime.split(':')[1]);

        const newDate = new Date(state.eventDate);

        newDate.setHours(hours, minutes);

        return {
            eventDate: newDate,
        };
    }),
});