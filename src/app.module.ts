import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { JobClassificationsModule } from './job-classifications/job-classifications.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dataSource } from './env';
import { JobLocationsModule } from './job-locations/job-locations.module';
import { PricingRulesModule } from './pricing-rules/pricing-rules.module';
import { RecruitmentBriefsModule } from './recruitment-briefs/recruitment-briefs.module';
import { RecruitmentFeeQuotationsModule } from './recruitment-fee-quotations/recruitment-fee-quotations.module';
import { AgencyFeeQuotationsModule } from './agency-fee-quotations/agency-fee-quotations.module';
import { AuthenticationModule } from './authentication/authentication.module';

@Module({
  imports: [
    // Suppress AuroraMysqlConnectionOptions errors
    TypeOrmModule.forRoot(dataSource as any),
    JobClassificationsModule,
    JobLocationsModule,
    PricingRulesModule,
    RecruitmentBriefsModule,
    RecruitmentFeeQuotationsModule,
    AgencyFeeQuotationsModule,
    AuthenticationModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
