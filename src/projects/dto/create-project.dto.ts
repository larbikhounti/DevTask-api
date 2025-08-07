import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsDateString, IsNumber, IsOptional, IsString } from "class-validator";
import { TransformToISODate } from "src/helpers/helper.helpers";





export class CreateProjectDto {
    @ApiProperty({
        description: 'The name of the project',
        example: 'Project Alpha',
        type: String,
    })
    @IsString()
    name: string;

    @ApiProperty({
        description: 'A brief description of the project',
        example: 'This project involves developing a new web application.',
        type: String,
        required: false,
    })
    @IsOptional()
    @IsString()
    description?: string;

    @ApiProperty({
        description: 'The client ID associated with the project',
        example: 1,
        type: Number,
    })
    @IsNumber()
    @Type(() => Number)
    clientId: number;

    @ApiProperty({
        description: 'The estimated start date for the project',
        example: '2023-01-01',
        type: String,
        required: false,
    })
    @IsOptional()
    @IsDateString()
    @TransformToISODate()
    startDate?: Date;

    @ApiProperty({
        description: 'The estimated end date for the project',
        example: '2023-12-31',
        type: String,
        required: false,
    })
    @IsOptional()
    @IsDateString()
    @TransformToISODate()
    endDate?: Date;
}
