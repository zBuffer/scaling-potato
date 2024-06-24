import { Module } from '@nestjs/common';
import { JobLocationsService } from './job-locations.service';
import { JobLocationsController } from './job-locations.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JobLocation } from './entities/job-location.entity';

@Module({
  imports: [TypeOrmModule.forFeature([JobLocation])],
  controllers: [JobLocationsController],
  providers: [JobLocationsService],
})
export class JobLocationsModule {}
