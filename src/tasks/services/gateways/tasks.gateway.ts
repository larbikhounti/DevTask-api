import { Inject, Injectable } from "@nestjs/common";
import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server, Socket } from 'socket.io';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { interval } from "rxjs";

@WebSocketGateway({
    cors: {
        origin: '*',
    },
    namespace: 'tasks',
})
@Injectable()
export class TasksGateway {

    constructor(

        @Inject(CACHE_MANAGER) private cacheManager: Cache
    ) { }

    @WebSocketServer()
    private readonly server: Server;

    @SubscribeMessage('tasks-timer')
    async emitTasksTimer(
        @ConnectedSocket() client: Socket,
        @MessageBody() tasksIds: number[]
    ) {
        console.log('Starting task timer for IDs:', tasksIds);

        const subscription = interval(1000).subscribe(async () => {
            const tasks = await this.cacheManager.get<
                { id: number; currentTimerSeconds: number }[]
            >('tasks-timer');

            if (!tasks || tasks.length === 0) {
                console.log('No tasks with timers found in cache');
                return;
            }

            const filteredTasks = tasks.filter((task) =>
                tasksIds.includes(task.id)
            );

            if (filteredTasks.length === 0) {
                console.log('No matching tasks found for provided IDs. Stopping interval.');
                subscription.unsubscribe();
                return;
            }

            client.emit('tasks-timer', filteredTasks);
        });

        // clean up on disconnect
        client.on('disconnect', () => {
            console.log('Client disconnected, stopping task timer');
            subscription.unsubscribe();
        });
    }

}