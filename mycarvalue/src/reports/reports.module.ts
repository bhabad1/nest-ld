import { Module } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { ReportsController } from './reports.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Report } from './report.entity';

@Module({
  providers: [ReportsService],
  controllers: [ReportsController],
  imports: [TypeOrmModule.forFeature([Report])], // Add entities here if needed
})
export class ReportsModule {}
