import { Body, Controller, Post } from '@nestjs/common';
import { CreatePartnerUserDto } from './dto/create-partner-user.dto';
import { UserPresenter } from './user.presenter';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}
  @Post()
  async create(@Body() createUserDto: CreatePartnerUserDto) {
    const user = await this.userService.createCommonUser(createUserDto);

    return new UserPresenter(user);
  }
}
