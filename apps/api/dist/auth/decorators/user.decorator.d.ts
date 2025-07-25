export interface UserFromToken {
    id: string;
    email: string;
    role: string;
    tenantId: string;
    createdAt: Date;
}
export declare const User: (...dataOrPipes: (keyof UserFromToken | import("@nestjs/common").PipeTransform<any, any> | import("@nestjs/common").Type<import("@nestjs/common").PipeTransform<any, any>>)[]) => ParameterDecorator;
