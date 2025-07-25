import { OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '../../../../database/generated/prisma';
export declare class PrismaService extends PrismaClient implements OnModuleInit {
    onModuleInit(): Promise<void>;
    onModuleDestroy(): Promise<void>;
}
