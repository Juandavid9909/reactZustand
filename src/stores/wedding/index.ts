import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

import { ConfirmationSlice, createConfirmationSlice } from './confirmation.slice';
import { createDateSlice, DateSlice } from './date.slice';
import { createGuestSlice, GuestSlice } from './guest.slice';
import { createPersonSlice, PersonSlice } from './person.slice';

type ShareState = PersonSlice & GuestSlice & DateSlice & ConfirmationSlice;

export const useWeddingBoundStore = create<ShareState>()(
    persist(
        devtools(
            (...a) => ({
                ...createPersonSlice(...a),
                ...createGuestSlice(...a),
                ...createDateSlice(...a),
                ...createConfirmationSlice(...a),
            })
        ),
        {
            name: 'wedding-store',
        }
    )
);