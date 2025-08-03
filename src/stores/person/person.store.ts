import { create, type StateCreator } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

import { firebaseStorage } from '../storages/firebase.storage';
import { useWeddingBoundStore } from '../wedding';

interface PersonState {
    firstName: string;
    lastName: string;
}

interface Actions {
    setFirstName: (value: string) => void;
    setLastName: (value: string) => void;
}

const storeApi: StateCreator<PersonState & Actions, [['zustand/devtools', never], ['zustand/persist', unknown]]> = (set) => ({
    firstName: '',
    lastName: '',

    setFirstName: (value: string) => set((state) => ({ firstName: value }), false, 'setFirstName'),
    setLastName: (value: string) => set((state) => ({ lastName: value }), false, 'setLastName'),
});

export const usePersonStore = create<PersonState & Actions>()(
    devtools(
        persist(
            storeApi,
            {
                name: 'person-storage',
                storage: firebaseStorage,
            }
        )
    )
);

usePersonStore.subscribe((nextState, /* prevState */) => {
    const { firstName, lastName } = nextState;

    useWeddingBoundStore.getState().setFirstName(firstName);
    useWeddingBoundStore.getState().setLastName(lastName);
});