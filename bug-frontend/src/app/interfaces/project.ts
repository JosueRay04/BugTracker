export enum category {
    open = 'OPEN',
    in_progress = 'IN PROGRESS',
    closed = 'CLOSED'
}

export interface Project {
    name?: string
    userName?: string
    description?: string
    createdAt?: Date
    expectedCompletionAt?: Date
    category?: category
    collaborators?: string[]
    role?: string
    projectName?: string;
    collaboratorName?: string;
    newCategory?: string;
    newRole?: string
}