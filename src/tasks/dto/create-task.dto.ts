export class CreateTaskDto {
    title: string;
    description: string;
    userId: number; // Assuming a task belongs to a user
    status?: string; // Optional field for task status
}
