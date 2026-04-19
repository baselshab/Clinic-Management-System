import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { User } from '../user/schemas/user.schema';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UnauthorizedException, ConflictException } from '@nestjs/common';

const mockUserModel = () => ({
  findOne: jest.fn().mockReturnThis(),
  findById: jest.fn().mockReturnThis(),
  find: jest.fn().mockReturnThis(),
  countDocuments: jest.fn(),
  create: jest.fn(),
  findByIdAndUpdate: jest.fn().mockReturnThis(),
  findByIdAndDelete: jest.fn().mockReturnThis(),
  select: jest.fn().mockReturnThis(),
});

const mockJwtService = () => ({
  sign: jest.fn().mockReturnValue('test-token'),
  verify: jest.fn().mockReturnValue({ id: '507f1f77bcf86cd799439011', email: 'test@test.com' }),
});

const mockConfigService = () => ({
  get: jest.fn().mockImplementation((key: string) => {
    const config = {
      'JWT_SECRET': 'test-secret',
      'JWT_EXPIRES_IN': '1d',
      'JWT_REFRESH_SECRET': 'test-refresh-secret',
      'JWT_REFRESH_EXPIRES_IN': '7d',
    };
    return config[key];
  }),
});

describe('AuthService', () => {
  let service: AuthService;
  let userModel: ReturnType<typeof mockUserModel>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        UserService,
        {
          provide: getModelToken(User.name),
          useFactory: mockUserModel,
        },
        {
          provide: JwtService,
          useFactory: mockJwtService,
        },
        {
          provide: ConfigService,
          useFactory: mockConfigService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userModel = module.get(getModelToken(User.name));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('login', () => {
    it('should throw UnauthorizedException when user not found', async () => {
      userModel.findOne.mockResolvedValue(null);

      await expect(service.login({ email: 'test@test.com', password: 'password123' }))
        .rejects.toThrow(UnauthorizedException);
    });
  });

  describe('register', () => {
    it('should throw ConflictException when email already exists', async () => {
      userModel.findOne.mockResolvedValue({
        _id: '507f1f77bcf86cd799439011',
        email: 'existing@test.com',
      });

      await expect(service.register({
        email: 'existing@test.com',
        name: 'Existing User',
        password: 'Password123',
      })).rejects.toThrow(ConflictException);
    });

    it('should create a new user successfully', async () => {
      const mockUser = {
        _id: new Types.ObjectId('507f1f77bcf86cd799439011'),
        email: 'newuser@test.com',
        name: 'New User',
        role: 'patient',
        status: 'active',
      };
      
      // First call: check existing (null), second call: after creation
      userModel.findOne
        .mockResolvedValueOnce(null)
        .mockResolvedValueOnce(mockUser);
      
      userModel.create.mockResolvedValue(mockUser);

      const result = await service.register({
        email: 'newuser@test.com',
        name: 'New User',
        password: 'Password123',
      });

      expect(userModel.create).toHaveBeenCalled();
      expect(result).toBeDefined();
    });
  });
});
