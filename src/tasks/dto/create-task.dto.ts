import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Priority } from "@prisma/client";
import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

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
    @IsOptional()
    userId?: number; // Assuming a task belongs to a user

    @ApiProperty({
        description: 'The ID of the project to which the task belongs',
        example: 1,
    })
    @IsNotEmpty()
    @IsNumber()
    projectId: number;

}
