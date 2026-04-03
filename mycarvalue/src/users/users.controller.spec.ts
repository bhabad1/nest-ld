import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { AuthService } from './auth.service';
import { User } from './user.entity';

describe('UsersController', () => {
  let controller: UsersController;

  let mockUserService: Partial<UsersService>;
  let mockAuthService: Partial<AuthService>;

  beforeEach(async () => {
    mockUserService = {
      findone: () => {
        return Promise.resolve({
          id: 1,
          email: 'asdf@dfhd.com',
          password: '1',
        } as User);
      },
      find: (email: string) => {
        return Promise.resolve([{ id: 1, email, password: '1' } as User]);
      },
      remove: () => {},
      update: () => {},
    };
    mockAuthService = {
      signin: (email, password) => {
        return Promise.resolve({ id: 1, email, password } as User);
      },
      signup: () => {},
    };
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: mockUserService,
        },
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('find all users returns a list of users with the given email', async () => {
    const users = await controller.findAllUsers('asdf@sad.com');
    expect(users.length).toEqual(1);
    expect(users[0].email).toEqual('asdf@sad.com');
  });

  it('find user returns a single user with the given id', async () => {
    const user = await controller.findUser('1');
    expect(user).toBeDefined();
    expect(user.id).toEqual(1);
  });
  it('find user throws an error if user with given id is not found', async () => {
    mockUserService.findone = () => null;
    await expect(controller.findUser('1')).rejects.toThrow();
  });
  it('signin updates session object and returns user', async () => {
    const session = { userId: -10 };
    const user = await controller.signin(
      { email: 'asdsdsd@cvcxc.com', password: 'password' },
      session,
    );
    expect(user).toBeDefined();
    expect(session.userId).toEqual(1);
  });
});
