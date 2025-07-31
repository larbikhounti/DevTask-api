import { ApiProperty } from "@nestjs/swagger";

export enum dateRangesEnum {
    today,
    yesterday,
    last7days,
    last30days,
    thisMonth,
    lastMonth,
}

export class FilterTasksDto {
    @ApiProperty({
        description: 'Filter by task date range',
        example: dateRangesEnum.last7days,
        required: false,
    })
    dateRange: dateRangesEnum;
}
