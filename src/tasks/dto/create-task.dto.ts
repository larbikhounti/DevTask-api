import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsBoolean, IsNotEmpty, IsNumber, IsString } from "class-validator";

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
}
