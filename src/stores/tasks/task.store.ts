import { create, StateCreator } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { v4 as uuidv4 } from 'uuid';

import type { Task, TaskStatus } from '../../interfaces';

interface TaskState {
    draggingTaskId?: string;
    tasks: Record<string, Task>;

    addTask: (title: string, status: TaskStatus) => void;
    changeTaskStatus: (taskId: string, status: TaskStatus) => void;
    getTaskByStatus: (status: TaskStatus) => Task[];
    onTaskDrop: (status: TaskStatus) => void;
    setDraggingTaskId: (taskId: string) => void;
    removeDraggingTaskId: () => void;
}

const storeApi: StateCreator<TaskState, [['zustand/devtools', never], ["zustand/persist", unknown], ['zustand/immer', never]]> = (set, get) => ({
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
    addTask: (title: string, status: TaskStatus) => {
        const newTask = {
            id: uuidv4(),
            title,
            status,
        };

        // set((state) => ({
        //     tasks: {
        //         ...state.tasks,
        //         [newTask.id]: newTask,
        //     },
        // }));

        // Necesita instalar npm install immer
        // set(produce((state: TaskState) => {
        //     state.tasks[newTask.id] = newTask;
        // }));

        // Middleware
        set((state) => {
            state.tasks[newTask.id] = newTask;
        });
    },
    changeTaskStatus: (taskId: string, status: TaskStatus) => {
        // set((state) => ({
        //     tasks: {
        //         ...state.tasks,
        //         [taskId]: task,
        //     },
        // }));

        set((state) => {
            state.tasks[taskId] = {
                ...state.tasks[taskId],
                status,
            };
        });
    },
    getTaskByStatus: (status: TaskStatus) => {
        const tasks = get().tasks;

        return Object.values(tasks).filter((task) => task.status === status);
    },
    onTaskDrop: (status: TaskStatus) => {
        const taskId = get().draggingTaskId;

        if(!taskId) return;

        get().changeTaskStatus(taskId, status);
        get().removeDraggingTaskId();
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
        persist(
            immer(
                storeApi
            ),
            {
                name: 'task-store'
            }
        )
    )
);