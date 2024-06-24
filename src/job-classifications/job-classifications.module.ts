import { Module } from '@nestjs/common';
import { JobClassificationsService } from './job-classifications.service';
import { JobClassificationsController } from './job-classifications.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JobClassification } from './entities/job-classification.entity';

@Module({
  imports: [TypeOrmModule.forFeature([JobClassification])],
  controllers: [JobClassificationsController],
  providers: [JobClassificationsService],
})
export class JobClassificationsModule {}
