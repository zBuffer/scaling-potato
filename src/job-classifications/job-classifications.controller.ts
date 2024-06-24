import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
} from '@nestjs/common';
import { JobClassificationsService } from './job-classifications.service';
import { CreateJobClassificationDto } from './dto/create-job-classification.dto';
import { UpdateJobClassificationDto } from './dto/update-job-classification.dto';
import { PaginateQuery, Paginate } from 'nestjs-paginate';
import {
  AllowPublic,
  AllowedRoles,
  AppRoles,
} from '../authentication/authentication.decorator';
import { throwNotFoundIfFalsey } from '../helpers';

@AllowedRoles(AppRoles.PRODUCT)
@Controller('job-classifications')
export class JobClassificationsController {
  constructor(
    private readonly jobClassificationsService: JobClassificationsService,
  ) {}

  @Post()
  create(@Body() createJobClassificationDto: CreateJobClassificationDto) {
    return this.jobClassificationsService.create(createJobClassificationDto);
  }

  @AllowPublic()
  @Get()
  findAll(@Paginate() query: PaginateQuery) {
    return this.jobClassificationsService.findAll(query);
  }

  @AllowPublic()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return throwNotFoundIfFalsey(this.jobClassificationsService.findOne(id));
  }

  @Patch(':id')
  @HttpCode(204)
  async update(
    @Param('id') id: string,
    @Body() updateJobClassificationDto: UpdateJobClassificationDto,
  ) {
    await throwNotFoundIfFalsey(this.jobClassificationsService.exists(id));
    return this.jobClassificationsService.update(
      id,
      updateJobClassificationDto,
    );
  }

  @Delete(':id')
  @HttpCode(204)
  async remove(@Param('id') id: string) {
    await throwNotFoundIfFalsey(this.jobClassificationsService.exists(id));
    return this.jobClassificationsService.remove(id);
  }
}
