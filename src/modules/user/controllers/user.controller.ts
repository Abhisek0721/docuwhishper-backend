import { Controller, Get, UseGuards } from '@nestjs/common';
import { UserService } from '../services/user.service';
import { ApiResponseT } from '@utils/types';
import { ApiUtilsService } from '@utils/utils.service';
import JwtAuthGuard from '@modules/auth/guards/jwt-auth.guard';
import { JwtDto } from 'src/common/dtos/jwt.dto';
import { GetUser } from 'src/common/decorators/user.decorator';

@Controller('user')
@UseGuards(JwtAuthGuard)
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly apiUtilsSevice: ApiUtilsService,
  ) {}

  @Get('profile')
  async profile(@GetUser() user: JwtDto): Promise<ApiResponseT> {
    const data = await this.userService.getProfile(user);
    return this.apiUtilsSevice.make_response(data);
  }
}
