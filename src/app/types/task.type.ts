export interface Task {
    id?: number,
    task: string,
    completed?: boolean | number,
    deadline?: Date //Optional to allow 'undefined'
}