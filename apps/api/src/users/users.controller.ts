import { Controller, Get, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { User, UserFromToken } from '../auth/decorators/user.decorator';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  async getProfile(@User() user: UserFromToken) {
    return this.usersService.getProfile(user.id);
  }

  @Get('tenant-users')
  async getTenantUsers(@User() user: UserFromToken) {
    // Solo permitir a admins ver todos los usuarios del tenant
    if (user.role !== 'ADMIN') {
      return { message: 'No tienes permisos para ver esta información' };
    }
    
    return this.usersService.getUsersByTenant(user.tenantId);
  }
} 