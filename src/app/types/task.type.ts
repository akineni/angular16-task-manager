export interface Task {
    id?: number,
    task: string,
    completed?: boolean | number,
    deadline?: string, // Optional to allow 'undefined'
    updating?: boolean
}