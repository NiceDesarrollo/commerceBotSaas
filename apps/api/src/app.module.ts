import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ProductsModule } from "./products/products.module";
import { AiModule } from "./ai/ai.module";
import { WhatsappModule } from "./whatsapp/whatsapp.module";
import { JwtAuthGuard } from "./auth/jwt-auth.guard";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ".env", // Archivo .env local en apps/api
    }),
    AuthModule,
    UsersModule,
    ProductsModule,
    AiModule,
    WhatsappModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {} 