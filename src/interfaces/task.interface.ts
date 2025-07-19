export interface Task {
    id: string;
    status: TaskStatus;
    title: string;
}

export type TaskStatus = 'open' | 'in-progress' | 'done';