import { Cron } from "@nestjs/schedule";

export class TasksCron {
  @Cron('0 0 * * *')
  handleCron() {
    console.log('Cron job executed');
  }
}