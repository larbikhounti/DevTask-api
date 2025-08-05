import { Inject, Injectable } from "@nestjs/common";
import { SubscribeMessage, WebSocketGateway } from "@nestjs/websockets";
import { Socket } from 'socket.io';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

@WebSocketGateway({
    cors: {
        origin: '*',
    },
    namespace: 'tasks',
})
@Injectable()
export class TasksGateway {

    constructor(
        @Inject('SOCKET_IO') private readonly socketIo: Socket,
        @Inject(CACHE_MANAGER) private cacheManager: Cache
    ) { }

    @SubscribeMessage('tasks-timer')
    async emitTasksTimer(tasksIds: number[]) {
        const tasks = await this.cacheManager.get<{ id: number, currentTimerSeconds : number }[]>('tasks-timer');
        if (!tasks || tasks.length === 0) {
            console.log('No tasks with timer found in cache');
            return;
        }
        const filteredTasks = tasks.filter(task => tasksIds.includes(task.id));
        if (filteredTasks.length === 0) {
            console.log('No tasks with timer found for the provided IDs');
            return;
        }
        this.socketIo.emit('tasks-timer', filteredTasks);
      
    }
}