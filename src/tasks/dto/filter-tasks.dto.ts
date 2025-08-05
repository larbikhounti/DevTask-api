import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";


export enum dateRangesEnum {
    today = 'today',
    yesterday = 'yesterday',
    last7days = 'last7days',
    last30days = 'last30days',
    thisMonth = 'thisMonth',
    lastMonth = 'lastMonth',
}

export class FilterTasksDto {
    @ApiPropertyOptional({
        description: 'Filter by task date range',
        example: 'last7days',
        required: false,
    })
    dateRange: dateRangesEnum;

    @ApiPropertyOptional({
        description: 'Filter by task completion status',
        example: true,
        required: false,
    })
    completed?: boolean;

    @ApiPropertyOptional({
        description: 'Filter by task priority',
        example: 'High',
        required: false,
    })
    priority?: string;

    @ApiPropertyOptional({
        description: 'Filter by task estimated time',
        example: 60,
        required: false,
    })
    estimatedTime?: number;

    @ApiPropertyOptional({
        description: 'Filter by task deadline',
        example: '2023-10-01T00:00:00Z',
        required: false,
    })
    deadline?: Date;
}
