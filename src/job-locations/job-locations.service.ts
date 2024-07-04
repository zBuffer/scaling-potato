import { Injectable } from '@nestjs/common';
import { CreateJobLocationDto } from './dto/create-job-location.dto';
import { UpdateJobLocationDto } from './dto/update-job-location.dto';
import { JobLocation } from './entities/job-location.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaginateQuery, Paginated, paginate } from 'nestjs-paginate';

@Injectable()
export class JobLocationsService {
  constructor(
    @InjectRepository(JobLocation)
    private readonly jobLocationRepository: Repository<JobLocation>,
  ) {}

  /**
   * Creates a new job location.
   * @param createJobLocationDto - The data for creating the job location.
   */
  async create(createJobLocationDto: CreateJobLocationDto) {
    await this.jobLocationRepository.insert(createJobLocationDto);
  }

  /**
   * Retrieves all job locations based on the provided query parameters.
   * @param query - The query parameters for pagination, sorting, and filtering.
   * @returns A promise that resolves to a paginated list of job locations.
   */
  findAll(query: PaginateQuery): Promise<Paginated<JobLocation>> {
    return paginate(query, this.jobLocationRepository, {
      sortableColumns: ['id', 'label'],
      searchableColumns: ['id'],
      filterableColumns: {
        id: true,
      },
      defaultSortBy: [['id', 'ASC']],
    });
  }

  /**
   * Retrieves a single job location by its ID.
   * @param id - The ID of the job location to retrieve.
   * @returns A promise that resolves to the job location, or null if not found.
   */
  async findOne(id: string): Promise<JobLocation | null> {
    return this.jobLocationRepository.findOneBy({ id });
  }

  /**
   * Updates a job location by its ID.
   * @param id - The ID of the job location to update.
   * @param updateJobLocationDto - The data for updating the job location.
   */
  async update(id: string, updateJobLocationDto: UpdateJobLocationDto) {
    await this.jobLocationRepository.update({ id }, updateJobLocationDto);
  }

  /**
   * Removes a job location by its ID.
   * @param id - The ID of the job location to remove.
   */
  async remove(id: string) {
    await this.jobLocationRepository.delete({ id });
  }

  /**
   * Checks if a job location exists by its ID.
   * @param id - The ID of the job location to check.
   * @returns A boolean indicating whether the job location exists or not.
   */
  exists(id: string) {
    return this.jobLocationRepository.existsBy({ id });
  }

  /**
   * Clears all job locations.
   */
  async clear() {
    await this.jobLocationRepository.delete({});
  }
}
