import { PrismaService } from '../prisma/prisma.service';
export declare class UsersService {
    private prisma;
    constructor(prisma: PrismaService);
    getProfile(userId: string): Promise<{
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
    getUsersByTenant(tenantId: string): Promise<{
        email: string;
        id: string;
        createdAt: Date;
        role: import("../../../../database/generated/prisma").$Enums.Role;
    }[]>;
}
