import { Injectable } from '@nestjs/common';
import { CreateRecruitmentBriefDto } from './dto/create-recruitment-brief.dto';
import { UpdateRecruitmentBriefDto } from './dto/update-recruitment-brief.dto';
import { RecruitmentBrief } from './entities/recruitment-brief.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, LessThanOrEqual, Repository } from 'typeorm';
import { PaginateQuery, Paginated, paginate } from 'nestjs-paginate';
import { randomUUID } from 'crypto';
import { PricingRule } from 'src/pricing-rules/entities/pricing-rule.entity';

@Injectable()
export class RecruitmentBriefsService {
  constructor(
    @InjectRepository(RecruitmentBrief)
    private readonly RecruitmentBriefRepository: Repository<RecruitmentBrief>,
  ) {}

  /**
   * Creates a new recruitment brief.
   *
   * @param createRecruitmentBriefDto - The data for creating the recruitment brief.
   * @param pricingRule - The pricing rule associated with the recruitment brief.
   * @returns The created recruitment brief.
   */
  async create(
    createRecruitmentBriefDto: CreateRecruitmentBriefDto,
    pricingRule: PricingRule,
  ) {
    const id = randomUUID();
    const created_at = new Date();
    const result = {
      ...createRecruitmentBriefDto,
      pricing_rule_id: pricingRule.id,
      id,
      created_at,
      updated_at: created_at,
      published_at: createRecruitmentBriefDto.published_at
        ? new Date(createRecruitmentBriefDto.published_at)
        : null,
    };
    await this.RecruitmentBriefRepository.insert(result);
    return result as RecruitmentBrief;
  }

  /**
   * Retrieves all recruitment briefs based on the provided query parameters.
   *
   * @param query - The pagination query parameters.
   * @param where - Optional filter options for the recruitment briefs.
   * @returns A promise that resolves to a paginated list of recruitment briefs.
   */
  findAll(
    query: PaginateQuery,
    where?:
      | FindOptionsWhere<RecruitmentBrief>
      | FindOptionsWhere<RecruitmentBrief>[],
  ): Promise<Paginated<RecruitmentBrief>> {
    return paginate(query, this.RecruitmentBriefRepository, {
      sortableColumns: [
        'id',
        'author',
        'created_at',
        'published_at',
        'job_classification_id',
        'job_location_id',
        'job_title',
        'annual_salary',
      ],
      searchableColumns: [
        'author',
        'job_classification_id',
        'job_location_id',
        'job_title',
      ],
      filterableColumns: {
        id: true,
        author: true,
        created_at: true,
        published_at: true,
        job_classification_id: true,
        job_location_id: true,
        annual_salary: true,
        job_title: true,
      },
      nullSort: 'first',
      defaultSortBy: [
        ['created_at', 'DESC'],
        ['published_at', 'DESC'],
      ],
      where,
    });
  }

  /**
   * Retrieves all published recruitment briefs or recruitment briefs authored by a specific author.
   * The author can only view recruitment briefs they authored or that are published.
   *
   * @param query - The query parameters for pagination.
   * @param author - The author of the recruitment briefs to filter by.
   * @returns A promise that resolves to the list of recruitment briefs.
   */
  findAllPublishedOrByAuthor(query: PaginateQuery, author: any) {
    return this.findAll(query, getRecruitmentBriefFiltersForAuthor(author));
  }

  /**
   * Finds a recruitment brief by its ID and optional query conditions.
   *
   * @param id - The ID of the recruitment brief to find.
   * @param where - Optional query conditions to filter the search.
   * @returns A promise that resolves to the found recruitment brief, or null if not found.
   */
  findOne(
    id: string,
    where?:
      | FindOptionsWhere<RecruitmentBrief>
      | FindOptionsWhere<RecruitmentBrief>[],
  ): Promise<RecruitmentBrief | null> {
    return this.RecruitmentBriefRepository.findOne({
      where:
        where && Array.isArray(where)
          ? where.map((w) => ({ ...w, id }))
          : { ...where, id },
    });
  }

  /**
   * Finds a published recruitment brief by its ID or by the author.
   * The author can only view recruitment briefs they authored or that are published.
   *
   * @param id - The ID of the recruitment brief.
   * @param author - The author of the recruitment brief.
   * @returns A Promise that resolves to the found recruitment brief.
   */
  findOnePublishedOrByAuthor(id: string, author: any) {
    return this.findOne(id, getRecruitmentBriefFiltersForAuthor(author));
  }

  /**
   * Checks if a recruitment brief exists for a given author.
   * @param id - The ID of the recruitment brief.
   * @param author - The author of the recruitment brief.
   * @returns A promise that resolves to a boolean indicating whether the recruitment brief exists.
   */
  existsByAuthor(id: string, author: any): Promise<boolean> {
    return this.RecruitmentBriefRepository.existsBy({ id, author });
  }

  /**
   * Updates a recruitment brief with the specified ID.
   *
   * @param id - The ID of the recruitment brief to update.
   * @param updateRecruitmentBriefDto - The data to update the recruitment brief with.
   * @returns A promise that resolves when the update is complete.
   */
  async update(
    id: string,
    updateRecruitmentBriefDto: UpdateRecruitmentBriefDto,
  ) {
    await this.RecruitmentBriefRepository.update(
      { id },
      updateRecruitmentBriefDto,
    );
  }

  /**
   * Updates the pricing rule for a recruitment brief.
   *
   * @param id - The ID of the recruitment brief.
   * @param pricing_rule_id - The ID of the pricing rule to be updated.
   * @returns A promise that resolves when the pricing rule is updated.
   */
  async updatePricingRule(id: string, pricing_rule_id: string) {
    await this.RecruitmentBriefRepository.update({ id }, { pricing_rule_id });
  }

  /**
   * Removes a recruitment brief by its ID.
   * @param id - The ID of the recruitment brief to remove.
   */
  async remove(id: string) {
    await this.RecruitmentBriefRepository.delete({ id });
  }

  /**
   * Clears all recruitment briefs.
   */
  async clear() {
    await this.RecruitmentBriefRepository.delete({});
  }
}

/**
 * Retrieves the recruitment brief filters for a specific user.
 * A user can only view recruitment briefs they authored or that are published.
 * @param author - The user object.
 * @returns The filter options for the recruitment briefs.
 */
function getRecruitmentBriefFiltersForAuthor(
  author: any,
): FindOptionsWhere<RecruitmentBrief> | FindOptionsWhere<RecruitmentBrief>[] {
  const now = new Date();
  return !author
    ? undefined
    : [{ author }, { published_at: LessThanOrEqual(now) }];
}
