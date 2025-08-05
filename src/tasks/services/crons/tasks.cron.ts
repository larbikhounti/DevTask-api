import { Cron } from "@nestjs/schedule";
import { TasksService } from "../tasks.service";
import { Inject, Injectable } from "@nestjs/common";
import { TasksGateway } from "../gateways/tasks.gateway";
import { CACHE_MANAGER } from "@nestjs/cache-manager";

@Injectable()
export class TasksCron {
    constructor(
        private readonly tasksService: TasksService,
        private readonly tasksGateway: TasksGateway,
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
            await this.tasksService.incrementTimerPerSecond(tasks);
            
        } catch (error) {
            console.error('Error executing cron job:', error);
        }
    }

}