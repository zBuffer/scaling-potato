import { Injectable } from '@nestjs/common';
import { CreateJobClassificationDto } from './dto/create-job-classification.dto';
import { UpdateJobClassificationDto } from './dto/update-job-classification.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { JobClassification } from './entities/job-classification.entity';
import { Repository } from 'typeorm';
import { PaginateQuery, Paginated, paginate } from 'nestjs-paginate';

@Injectable()
export class JobClassificationsService {
  constructor(
    @InjectRepository(JobClassification)
    private readonly jobClassificationRepository: Repository<JobClassification>,
  ) {}

  /**
   * Creates a new job classification.
   * @param createJobClassificationDto - The data for creating the job classification.
   */
  async create(createJobClassificationDto: CreateJobClassificationDto) {
    await this.jobClassificationRepository.insert(createJobClassificationDto);
  }

  /**
   * Retrieves all job classifications.
   * @param query - The query parameters for pagination and filtering.
   * @returns A promise that resolves to a paginated list of job classifications.
   */
  findAll(query: PaginateQuery): Promise<Paginated<JobClassification>> {
    return paginate(query, this.jobClassificationRepository, {
      sortableColumns: ['id', 'label'],
      searchableColumns: ['id'],
      filterableColumns: {
        id: true,
      },
      defaultSortBy: [['id', 'ASC']],
    });
  }

  /**
   * Finds a job classification by its ID.
   * @param id - The ID of the job classification to find.
   * @returns A Promise that resolves to the found job classification, or null if not found.
   */
  async findOne(id: string): Promise<JobClassification | null> {
    return this.jobClassificationRepository.findOneBy({ id });
  }

  /**
   * Updates a job classification.
   * @param id - The ID of the job classification to update.
   * @param updateJobClassificationDto - The data for updating the job classification.
   */
  async update(
    id: string,
    updateJobClassificationDto: UpdateJobClassificationDto,
  ) {
    await this.jobClassificationRepository.update(
      { id },
      updateJobClassificationDto,
    );
  }

  /**
   * Removes a job classification.
   * @param id - The ID of the job classification to remove.
   */
  async remove(id: string) {
    await this.jobClassificationRepository.delete({ id });
  }

  /**
   * Checks if a job classification exists.
   * @param id - The ID of the job classification to check.
   * @returns A boolean indicating whether the job classification exists.
   */
  exists(id: string) {
    return this.jobClassificationRepository.existsBy({ id });
  }

  /**
   * Clears all job classifications.
   */
  async clear() {
    await this.jobClassificationRepository.delete({});
  }
}
