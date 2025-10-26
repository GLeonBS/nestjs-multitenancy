import { Body, Controller, Post } from '@nestjs/common';
import { CreatePartnerUserDto } from '../users/dto/create-partner-user.dto';
import { UserPresenter } from '../users/user.presenter';
import { UsersService } from '../users/users.service';

@Controller('partner/users')
export class PartnerUsersController {
  constructor(private readonly userService: UsersService) {}
  @Post()
  async create(@Body() createUserDto: CreatePartnerUserDto) {
    const user = await this.userService.createPartnerUser(createUserDto);

    return new UserPresenter(user);
  }
}
