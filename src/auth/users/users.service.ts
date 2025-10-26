import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCommonUserDto } from './dto/create-common-user.dto';
import { CreatePartnerUserDto } from './dto/create-partner-user.dto';
import { UserRoles } from './user-roles';

@Injectable()
export class UsersService {
  constructor(private readonly prismaService: PrismaService) {}

  createPartnerUser(createUserDto: CreatePartnerUserDto) {
    return this.prismaService.user.create({
      data: {
        ...createUserDto,
        password: this.generateHash(createUserDto.password),
        roles: [UserRoles.PARTNER],
      },
    });
  }

  createCommonUser(createUserDto: CreateCommonUserDto) {
    return this.prismaService.user.create({
      data: {
        ...createUserDto,
        password: this.generateHash(createUserDto.password),
        roles: [UserRoles.USER],
      },
    });
  }

  generateHash(password: string): string {
    return bcrypt.hashSync(password, 10);
  }

  findOne(idOrEmail: number | string) {
    const where =
      typeof idOrEmail === 'number' ? { id: idOrEmail } : { email: idOrEmail };

    return this.prismaService.user.findFirst({ where });
  }
}
