import { Controller, Get, Query, Request } from '@nestjs/common';
import { DashboardService } from '../services/dashboard.service';
import { FilterTasksDto } from '../dto/filter-tasks.dto';

@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

}
