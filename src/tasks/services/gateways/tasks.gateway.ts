import { Inject, Injectable } from "@nestjs/common";
import { SubscribeMessage, WebSocketGateway } from "@nestjs/websockets";
import { tasks } from "@prisma/client";
import { Observable } from "rxjs";
import { Socket } from 'socket.io';
import { TasksService } from "../tasks.service";
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
    ) { }

    @SubscribeMessage('tasks-timer')
    async emitTasksTimer(tasksIds: number[]) {
        
        this.socketIo.emit('tasks-timer', `Timer tick: ${new Date().toISOString()}`);  

      
    }
}