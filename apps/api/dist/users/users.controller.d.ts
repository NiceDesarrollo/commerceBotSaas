import { UsersService } from './users.service';
import { UserFromToken } from '../auth/decorators/user.decorator';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    getProfile(user: UserFromToken): Promise<{
        tenant: {
            id: string;
            name: string;
            slug: string;
            logoUrl: string;
        };
        email: string;
        tenantId: string;
        id: string;
        createdAt: Date;
        role: import("../../../../database/generated/prisma").$Enums.Role;
    }>;
    getTenantUsers(user: UserFromToken): Promise<{
        email: string;
        id: string;
        createdAt: Date;
        role: import("../../../../database/generated/prisma").$Enums.Role;
    }[] | {
        message: string;
    }>;
}
