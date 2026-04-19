import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { AppointmentService } from './appointment.service';
import { Appointment } from './schemas/appointment.schema';

const mockAppointmentModel = () => ({
  findOne: jest.fn(),
  findById: jest.fn(),
  find: jest.fn(),
  countDocuments: jest.fn().mockResolvedValue(0),
  create: jest.fn(),
  findByIdAndUpdate: jest.fn(),
  findByIdAndDelete: jest.fn(),
  aggregate: jest.fn().mockResolvedValue([]),
});

describe('AppointmentService', () => {
  let service: AppointmentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AppointmentService,
        { provide: getModelToken(Appointment.name), useFactory: mockAppointmentModel },
      ],
    }).compile();

    service = module.get<AppointmentService>(AppointmentService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('count', () => {
    it('should return appointment count', async () => {
      const mockModel = { countDocuments: jest.fn().mockResolvedValue(10) };
      (service as any).appointmentModel = mockModel;
      const result = await service.count();
      expect(result).toBe(10);
    });
  });
});
