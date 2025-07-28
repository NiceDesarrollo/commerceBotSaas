import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Put,
  Query,
  HttpCode,
  HttpStatus,
  UseGuards,
  DefaultValuePipe,
  ParseIntPipe,
} from '@nestjs/common';
import { AiService } from './ai.service';
import { AiProviderService } from "./services/ai-provider.service";
import { ChatMessageDto } from "./dto/chat-message.dto";
import { UpdateBotConfigDto, TestBotConfigDto } from "./dto/bot-config.dto";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { User, UserFromToken } from "../auth/decorators/user.decorator";

@Controller("ai")
@UseGuards(JwtAuthGuard)
export class AiController {
  constructor(
    private readonly aiService: AiService,
    private readonly aiProviderService: AiProviderService
  ) {}

  // Enviar mensaje al chat de IA
  @Post("chat")
  @HttpCode(HttpStatus.OK)
  async sendMessage(
    @Body() chatDto: ChatMessageDto,
    @User() user: UserFromToken
  ) {
    return this.aiService.sendMessage(user.tenantId, chatDto);
  }

  // Obtener configuración del bot
  @Get("bot-config")
  async getBotConfig(@User() user: UserFromToken) {
    return this.aiService.getBotConfig(user.tenantId);
  }

  // Actualizar configuración del bot
  @Put("bot-config")
  async updateBotConfig(
    @Body() updateDto: UpdateBotConfigDto,
    @User() user: UserFromToken
  ) {
    return this.aiService.updateBotConfig(user.tenantId, updateDto);
  }

  // Probar configuración del bot
  @Post("bot-config/test")
  @HttpCode(HttpStatus.OK)
  async testBotConfig(
    @Body() testDto: TestBotConfigDto,
    @User() user: UserFromToken
  ) {
    return this.aiService.testBotConfig(user.tenantId, testDto);
  }

  // Obtener historial de conversaciones
  @Get("conversations")
  async getConversations(
    @Query("limit", new DefaultValuePipe(50), ParseIntPipe) limit: number,
    @User() user: UserFromToken
  ) {
    return this.aiService.getConversations(user.tenantId, limit);
  }

  // Obtener estado de proveedores de IA
  @Get("providers/status")
  async getProvidersStatus() {
    return this.aiProviderService.getProviderStatus();
  }
} 