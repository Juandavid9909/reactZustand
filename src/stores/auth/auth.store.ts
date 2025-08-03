import { create, StateCreator } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

import type { AuthStatus, User } from '../../interfaces';
import { AuthService } from '../../services/auth.service';

export interface AuthState {
    status: AuthStatus;
    token?: string;
    user?: User;
    checkAuthStatus: () => Promise<void>;
    loginUser: (email: string, password: string) => Promise<void>;
    logoutUser: () => void;
}

const storeApi: StateCreator<AuthState> = (set) => ({
    status: 'pending',
    token: undefined,
    user: undefined,
    checkAuthStatus: async () => {
        try {
            const { token, ...user } = await AuthService.checkStatus();

            set({ status: 'authorized', token, user });
        } catch (error) {
            set({ status: 'unauthorized', token: undefined, user: undefined });
        }
    },
    loginUser: async (email: string, password: string) => {
        try {
            const { token, ...user } = await AuthService.login(email, password)

            set({ status: 'authorized', token, user });
        } catch (error) {
            set({ status: 'unauthorized', token: undefined, user: undefined });

            throw 'Unauthorized';
        }
    },
    logoutUser: () => {
        set({ status: 'unauthorized', token: undefined, user: undefined });
    },
});

export const useAuthStore = create<AuthState>()(
    devtools(
        persist(
            storeApi,
            {
                name: 'auth-storage'
            },
        )
    )
);