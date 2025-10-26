import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './login.dto';
import { UsersService } from './users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async login(login: LoginDto) {
    const user = await this.userService.findOne(login.email);

    if (!user || bcrypt.compareSync(login.password, user.password) === false) {
      throw new Error('Invalid credentials');
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...userData } = user;

    return {
      access_token: this.jwtService.sign(userData),
    };
  }
}
