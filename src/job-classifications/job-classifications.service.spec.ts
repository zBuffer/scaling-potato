import { Test, TestingModule } from '@nestjs/testing';
import { JobClassificationsService } from './job-classifications.service';
import { ImportFixture } from '../test-utils/fixture';

describe('JobClassificationsService', () => {
  let module: TestingModule;
  let service: JobClassificationsService;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: ImportFixture,
      providers: [JobClassificationsService],
    }).compile();

    service = module.get<JobClassificationsService>(JobClassificationsService);
  });

  afterEach(async () => {
    await module.close();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
