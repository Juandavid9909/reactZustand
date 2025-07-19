import { create, StateCreator } from 'zustand';
import { devtools } from 'zustand/middleware';

import type { Task, TaskStatus } from '../../interfaces';

interface TaskState {
    draggingTaskId?: string;
    tasks: Record<string, Task>;

    getTaskByStatus: (status: TaskStatus) => Task[];
    setDraggingTaskId: (taskId: string) => void;
    removeDraggingTaskId: () => void;
}

const storeApi: StateCreator<TaskState> = (set, get) => ({
    draggingTaskId: undefined,
    tasks: {
        'ABC-1': {
            id: 'ABC-1',
            status: 'open',
            title: 'Task 1',
        },
        'ABC-2': {
            id: 'ABC-2',
            status: 'in-progress',
            title: 'Task 2',
        },
        'ABC-3': {
            id: 'ABC-3',
            status: 'open',
            title: 'Task 3',
        },
        'ABC-4': {
            id: 'ABC-4',
            status: 'open',
            title: 'Task 4',
        },
    },
    getTaskByStatus: (status: TaskStatus) => {
        const tasks = get().tasks;

        return Object.values(tasks).filter((task) => task.status === status);
    },
    setDraggingTaskId: (taskId: string) => {
        set({ draggingTaskId: taskId });
    },
    removeDraggingTaskId: () => {
        set({ draggingTaskId: undefined });
    },
});

export const useTaskStore = create<TaskState>()(
    devtools(
        storeApi,
    )
);