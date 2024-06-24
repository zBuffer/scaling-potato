import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  HttpCode,
  Inject,
} from '@nestjs/common';
import { RecruitmentBriefsService } from './recruitment-briefs.service';
import { CreateRecruitmentBriefDto } from './dto/create-recruitment-brief.dto';
import { UpdateRecruitmentBriefDto } from './dto/update-recruitment-brief.dto';
import { PaginateQuery, Paginate } from 'nestjs-paginate';
import { throwBadRequestIfFalsey, throwNotFoundIfFalsey } from '../helpers';
import { PricingRulesService } from '../pricing-rules/pricing-rules.service';
import {
  AllowedRoles,
  AppRoles,
  User,
} from '../authentication/authentication.decorator';

@Controller('recruitment-briefs')
export class RecruitmentBriefsController {
  constructor(
    private readonly recruitmentBriefsService: RecruitmentBriefsService,
    @Inject(PricingRulesService)
    private readonly pricingRulesService: PricingRulesService,
  ) {}

  @AllowedRoles(AppRoles.HIRER)
  @Post()
  async create(
    @Body() createRecruitmentBriefDto: CreateRecruitmentBriefDto,
    @User() user: any,
  ) {
    // Find the latest pricing rule
    const latestPricingRule = await throwBadRequestIfFalsey(
      this.pricingRulesService.findLatest(
        createRecruitmentBriefDto.job_classification_id,
        createRecruitmentBriefDto.job_location_id,
      ),
    );
    return this.recruitmentBriefsService.create(
      {
        ...createRecruitmentBriefDto,
        author: user.sub,
      },
      latestPricingRule,
    );
  }

  @Get()
  findAll(@Paginate() query: PaginateQuery, @User() user: any) {
    const now = new Date();
    return this.recruitmentBriefsService.findAllPublishedOrByAuthor(
      query,
      user?.sub,
    );
  }

  @Get(':id')
  findOne(@Param('id') id: string, @User() user: any) {
    const now = new Date();
    return throwNotFoundIfFalsey(
      this.recruitmentBriefsService.findOnePublishedOrByAuthor(id, user?.sub),
    );
  }

  @AllowedRoles(AppRoles.HIRER)
  @HttpCode(204)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateRecruitmentBriefDto: UpdateRecruitmentBriefDto,
    @User() user: any
  ) {
    await throwNotFoundIfFalsey(this.recruitmentBriefsService.existsByAuthor(id, user?.sub));
    await throwBadRequestIfFalsey(updateRecruitmentBriefDto);
    return this.recruitmentBriefsService.update(id, updateRecruitmentBriefDto);
  }
}
