import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PatientService } from './patient.service';
import { Patient } from './schemas/patient.schema';

const mockPatientModel = () => ({
  findOne: jest.fn(),
  findById: jest.fn(),
  find: jest.fn(),
  countDocuments: jest.fn().mockResolvedValue(0),
  create: jest.fn(),
  findByIdAndUpdate: jest.fn(),
  findByIdAndDelete: jest.fn(),
  aggregate: jest.fn().mockResolvedValue([]),
});

describe('PatientService', () => {
  let service: PatientService;
  let model: ReturnType<typeof mockPatientModel>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PatientService,
        { provide: getModelToken(Patient.name), useFactory: mockPatientModel },
      ],
    }).compile();

    service = module.get<PatientService>(PatientService);
    model = module.get(getModelToken(Patient.name));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return paginated patients', async () => {
      const mockPatients = [
        { _id: '1', firstName: 'John', lastName: 'Doe', patientCode: 'PAT-001' },
      ];

      model.find.mockReturnValue({
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        sort: jest.fn().mockResolvedValue(mockPatients),
      });
      model.countDocuments.mockResolvedValue(1);

      const result = await service.findAll(1, 10);

      expect(result.patients).toBeDefined();
      expect(result.total).toBe(1);
      expect(result.page).toBe(1);
    });
  });

  describe('findOne', () => {
    it('should throw BadRequestException for invalid ID', async () => {
      await expect(service.findOne('invalid-id')).rejects.toThrow();
    });

    it('should throw NotFoundException when patient not found', async () => {
      model.findById.mockResolvedValue(null);
      await expect(service.findOne('507f1f77bcf86cd799439011')).rejects.toThrow();
    });
  });

  describe('count', () => {
    it('should return patient count', async () => {
      model.countDocuments.mockResolvedValue(5);
      const result = await service.count();
      expect(result).toBe(5);
    });
  });
});
