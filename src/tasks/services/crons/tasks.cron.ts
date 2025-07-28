import { Cron } from "@nestjs/schedule";
import { TasksService } from "../tasks.service";
import { Injectable } from "@nestjs/common";

@Injectable()
export class TasksCron {
    constructor(
        private readonly tasksService: TasksService,
    ) { }

    // This method will be executed every second
    @Cron('*/1 * * * * *')
    async handleCron() {
        try {
            const tasks = await this.tasksService.findEnabledTimerTasks();
            if (!tasks || tasks.length === 0) {
                console.log('No tasks with timer enabled found');
                return;
            }
            // for each task, check if the current date is greater than the timer date
            tasks.forEach(task => {
                if (task.currentTimer && new Date(task.currentTimer) <= new Date()) {
                    this.tasksService.incrementTimerPerSecond(task);
                }
            });
        } catch (error) {
            console.error('Error executing cron job:', error);
        }
    }

}