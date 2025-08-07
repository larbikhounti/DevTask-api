import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsOptional, IsString } from "class-validator";

export class CreateClientDto {

    @ApiProperty({
        description: 'The name of the client',
        example: 'John Doe',
        type: String,
    })
    @IsString()
    name: string;

    @ApiProperty({
        description: 'The email of the client',
        example: 'john.doe@example.com',
        type: String,
    })
    @IsString()
    @IsEmail()
    email: string;

    @ApiProperty({
        description: 'The phone number of the client',
        example: '+1234567890',
        type: String,
        required: false,
    })
    @IsString()
    @IsOptional()
    phone?: string;

    
    @ApiProperty({
        description: 'The address of the client',
        example: '123 Main St, Springfield, USA',
        type: String,
        required: false,
    })
    @IsString()
    @IsOptional()
    address?: string;
}
