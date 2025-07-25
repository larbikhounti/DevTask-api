import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Priority } from "@prisma/client";
import { IsBoolean, IsEnum, IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateTaskDto {
    @ApiProperty({
        description: 'The title of the task',
        example: 'Implement authentication',
    })
    @IsNotEmpty()
    @IsString()
    title: string;

    @ApiProperty({
        description: 'The description of the task',
        example: 'Implement JWT authentication for the API',
    })
    description: string;


    @ApiProperty({
        description: 'The ID of the user who owns the task',
        example: 1,
    })
    @IsNotEmpty()
    @IsNumber()
    userId: number; // Assuming a task belongs to a user

    @ApiPropertyOptional({
        description: 'priority of the task',
        example: Priority.Low,
    })
    @IsEnum(Priority)
    priority: Priority;

    @ApiPropertyOptional({
        description: 'Estimated time to complete the task in hours',
        example: 2,
    })
    @IsNumber()
    estimatedTime: number;
    
    @ApiPropertyOptional({
        description: 'Deadline for the task',
        example: '2023-12-31T23:59:59Z',
    })
    deadline: Date;

}
