import { Test } from '@nestjs/testing';

import { AuthService } from './auth.service';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('AuthService', () => {
  let service: AuthService;
  let fakeUserService: Partial<UsersService>;

  beforeEach(async () => {
    const users: User[] = [];
    fakeUserService = {
      //   find: () => Promise.resolve([]),
      find: (email: string) => {
        const filteredUsers = users.filter((user) => user.email === email);
        return Promise.resolve(filteredUsers);
      },
      create: (email: string, password: string) => {
        const user = {
          id: Math.floor(Math.random() * 89999999),
          email,
          password,
        } as User;
        users.push(user);
        return Promise.resolve(user);
      },
    };
    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: fakeUserService },
      ],
    }).compile();
    service = module.get(AuthService);
  });

  it('can create a instance of auth service', () => {
    expect(service).toBeDefined();
  });

  it('creates a new user with a salted and hashed password', async () => {
    const user = await service.signup('asdf@syg.com', 'asdf');
    expect(user.password).not.toEqual('asdf');
    const [salt, hash] = user.password.split('.');
    expect(salt).toBeDefined();
    expect(hash).toBeDefined();
  });

  it('throws an error if user signs up with email that is in use', async () => {
    // fakeUserService.find = () =>
    //   Promise.resolve([{ id: 1, email: 'a', password: '1' } as User]);

    await service.signup('a', '1');

    await expect(service.signup('a', '1')).rejects.toThrow(BadRequestException);
  });

  it('throws if signin is called with an unused email', async () => {
    await expect(service.signin('sdsdh@sjhdf.com', 'sdf')).rejects.toThrow(
      NotFoundException,
    );
  });

  it('throws if an invalid password is provided', async () => {
    // fakeUserService.find = () =>
    //   Promise.resolve([
    //     { email: 'ajsjdh@gsdhj.com', password: 'asdf' } as User,
    //   ]);

    await service.signup('ajsjdh@gsdhj.com', 'asdf');

    await expect(
      service.signin('ssjdhsadh@sjhfd.com', 'password'),
    ).rejects.toThrow(NotFoundException);
  });

  it('returns a user if correct password is provided', async () => {
    // fakeUserService.find = () =>
    //   Promise.resolve([
    //     {
    //       email: 'asjabd@jhsd.com',
    //       password:
    //         '8a3e1f318ab2ffa1.ab545ed9f6e6289cb7833cfd6c737d761937fd1196af39e4309715be796a4ceb',
    //     } as User,
    //   ]);

    await service.signup('asjabd@jhsd.com', 'password');

    const user = await service.signin('asjabd@jhsd.com', 'password');
    expect(user).toBeDefined();
  });
});
