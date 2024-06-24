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
import { JobLocationsService } from './job-locations.service';
import { CreateJobLocationDto } from './dto/create-job-location.dto';
import { UpdateJobLocationDto } from './dto/update-job-location.dto';
import { PaginateQuery, Paginate } from 'nestjs-paginate';
import {
  AllowPublic,
  AllowedRoles,
  AppRoles,
} from '../authentication/authentication.decorator';
import { throwNotFoundIfFalsey } from '../helpers';

@AllowedRoles(AppRoles.PRODUCT)
@Controller('job-locations')
export class JobLocationsController {
  constructor(private readonly jobLocationsService: JobLocationsService) {}

  @Post()
  create(@Body() createJobLocationDto: CreateJobLocationDto) {
    return this.jobLocationsService.create(createJobLocationDto);
  }

  @AllowPublic()
  @Get()
  findAll(@Paginate() query: PaginateQuery) {
    return this.jobLocationsService.findAll(query);
  }

  @AllowPublic()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return throwNotFoundIfFalsey(this.jobLocationsService.findOne(id));
  }

  @Patch(':id')
  @HttpCode(204)
  async update(
    @Param('id') id: string,
    @Body() updateJobLocationDto: UpdateJobLocationDto,
  ) {
    await throwNotFoundIfFalsey(this.jobLocationsService.exists(id));
    return this.jobLocationsService.update(id, updateJobLocationDto);
  }

  @Delete(':id')
  @HttpCode(204)
  async remove(@Param('id') id: string) {
    await throwNotFoundIfFalsey(this.jobLocationsService.exists(id));
    return this.jobLocationsService.remove(id);
  }
}
