import { Test, TestingModule } from '@nestjs/testing';
import { JobLocationsService } from './job-locations.service';
import { ImportFixture } from '../test-utils/fixture';

describe('JobLocationsService', () => {
  let module: TestingModule;
  let service: JobLocationsService;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: ImportFixture,
      providers: [JobLocationsService],
    }).compile();

    service = module.get<JobLocationsService>(JobLocationsService);
  });

  afterEach(async () => {
    await module.close();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
