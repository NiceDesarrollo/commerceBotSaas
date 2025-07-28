import { Injectable, BadRequestException, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { ConfigService } from "@nestjs/config";
import { PrismaService } from "../prisma/prisma.service";
import { ChatMessageDto, ChatResponseDto } from "./dto/chat-message.dto";
import { UpdateBotConfigDto, TestBotConfigDto } from "./dto/bot-config.dto";
import { AiProviderService } from "./services/ai-provider.service";

@Injectable()
export class AiService {
  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
    private aiProviderService: AiProviderService
  ) {}

  // Obtener o crear configuración del bot para el tenant
  async getBotConfig(tenantId: string) {
    try {
      let botConfig = await this.prisma.botConfig.findUnique({
        where: { tenantId },
        include: {
          tenant: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
        },
      });

      // Si no existe, crear configuración por defecto
      if (!botConfig) {
        botConfig = await this.prisma.botConfig.create({
          data: {
            tenantId,
            botName: "Asistente IA",
            promptStyle: "Amable, clara y persuasiva",
            greeting:
              "Hola, soy tu asistente virtual. ¿En qué puedo ayudarte hoy?",
            temperature: 0.7,
            useImages: true,
          },
          include: {
            tenant: {
              select: {
                id: true,
                name: true,
                slug: true,
              },
            },
          },
        });
      }

      return botConfig;
    } catch (error) {
      throw new BadRequestException(
        "Error al obtener la configuración del bot"
      );
    }
  }

  // Actualizar configuración del bot
  async updateBotConfig(tenantId: string, updateDto: UpdateBotConfigDto) {
    try {
      // Asegurar que existe la configuración
      await this.getBotConfig(tenantId);

      const updatedConfig = await this.prisma.botConfig.update({
        where: { tenantId },
        data: updateDto,
        include: {
          tenant: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
        },
      });

      return updatedConfig;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException(
        "Error al actualizar la configuración del bot"
      );
    }
  }

  // Enviar mensaje al modelo de IA
  async sendMessage(
    tenantId: string,
    chatDto: ChatMessageDto
  ): Promise<ChatResponseDto> {
    try {
      // Obtener configuración del bot
      const botConfig = await this.getBotConfig(tenantId);

      // Obtener productos del tenant para contexto
      const products = await this.getProductsContext(tenantId);

      // Obtener información del tenant
      const tenant = await this.prisma.tenant.findUnique({
        where: { id: tenantId },
        select: { name: true, slug: true },
      });

      // Construir prompt contextual
      const systemPrompt = this.buildSystemPrompt(botConfig, tenant, products);

      // Obtener historial si hay conversationId
      let conversationHistory = "";
      if (chatDto.conversationId) {
        conversationHistory = await this.getConversationHistory(
          chatDto.conversationId,
          tenantId
        );
      }

      // Construir mensaje completo
      const fullMessage = `${systemPrompt}\n\nHistorial de conversación:\n${conversationHistory}\n\nUsuario: ${chatDto.message}\n\nAsistente:`;

      // Usar el proveedor de IA configurado
      const aiConfig = {
        temperature: botConfig.temperature,
        model: (botConfig as any).aiModel || undefined,
      };

      const aiResult = await this.aiProviderService.generateResponse(
        fullMessage,
        aiConfig
      );

      // Generar ID de conversación si no existe
      const conversationId =
        chatDto.conversationId || this.generateConversationId();

      // Guardar historial de la conversación
      await this.saveConversationHistory(
        tenantId,
        conversationId,
        chatDto.message,
        aiResult.text,
        chatDto.clientPhone
      );

      return {
        response: aiResult.text,
        conversationId,
        timestamp: new Date(),
        tokensUsed: aiResult.tokensUsed,
        model: aiResult.model,
        provider: aiResult.provider,
      };
    } catch (error) {
      console.error("Error en IA:", error);
      throw new InternalServerErrorException(
        "Error al procesar el mensaje con IA"
      );
    }
  }

  // Probar configuración del bot
  async testBotConfig(tenantId: string, testDto: TestBotConfigDto) {
    const chatDto: ChatMessageDto = {
      message: testDto.testMessage,
      conversationId: `test-${Date.now()}`,
    };

    const response = await this.sendMessage(tenantId, chatDto);

    return {
      ...response,
      isTest: true,
      testMessage: testDto.testMessage,
    };
  }

  // Obtener historial de conversaciones del tenant
  async getConversations(tenantId: string, limit: number = 50) {
    try {
      const conversations = await this.prisma.chatHistory.findMany({
        where: { tenantId },
        orderBy: { timestamp: "desc" },
        take: limit,
        select: {
          id: true,
          clientPhone: true,
          direction: true,
          message: true,
          timestamp: true,
        },
      });

      // Agrupar por conversación (clientPhone)
      const groupedConversations = conversations.reduce(
        (acc, msg) => {
          const key = msg.clientPhone || "general";
          if (!acc[key]) {
            acc[key] = [];
          }
          acc[key].push(msg);
          return acc;
        },
        {} as Record<string, any[]>
      );

      return {
        conversations: groupedConversations,
        totalMessages: conversations.length,
        clients: Object.keys(groupedConversations).length,
      };
    } catch (error) {
      throw new BadRequestException("Error al obtener conversaciones");
    }
  }

  // MÉTODOS PRIVADOS

  private buildSystemPrompt(
    botConfig: any,
    tenant: any,
    products: any[]
  ): string {
    const productsContext =
      products.length > 0
        ? `\n\nProductos disponibles:\n${products.map((p) => `- ${p.name}: $${p.price} (Stock: ${p.stock})`).join("\n")}`
        : "";

    return `Eres ${botConfig.botName}, un asistente virtual para ${tenant?.name || "la empresa"}.

PERSONALIDAD: ${botConfig.promptStyle}

SALUDO: ${botConfig.greeting}

INSTRUCCIONES:
- Ayuda a los clientes con preguntas sobre productos y servicios
- Si preguntan por productos específicos, usa la información disponible
- Mantén un tono profesional pero cercano
- Si no sabes algo, di que consultarás con el equipo
- Siempre intenta ser útil y resolver las dudas del cliente
${productsContext}

Responde de forma clara, concisa y helpful.`;
  }

  private async getProductsContext(tenantId: string): Promise<any[]> {
    try {
      return await this.prisma.product.findMany({
        where: {
          tenantId,
          stock: { gt: 0 }, // Solo productos con stock
        },
        select: {
          id: true,
          name: true,
          description: true,
          price: true,
          category: true,
          stock: true,
          tags: true,
        },
        take: 20, // Limitar para no sobrecargar el prompt
        orderBy: { createdAt: "desc" },
      });
    } catch (error) {
      console.error("Error obteniendo productos para contexto:", error);
      return [];
    }
  }

  private async getConversationHistory(
    conversationId: string,
    tenantId: string
  ): Promise<string> {
    try {
      const history = await this.prisma.chatHistory.findMany({
        where: {
          tenantId,
          clientPhone: conversationId, // Usando clientPhone como conversationId por simplicidad
        },
        orderBy: { timestamp: "asc" },
        take: 10, // Últimos 10 mensajes
        select: {
          direction: true,
          message: true,
          timestamp: true,
        },
      });

      return history
        .map(
          (h) =>
            `${h.direction === "INCOMING" ? "Usuario" : "Asistente"}: ${h.message}`
        )
        .join("\n");
    } catch (error) {
      console.error("Error obteniendo historial:", error);
      return "";
    }
  }

  private async saveConversationHistory(
    tenantId: string,
    conversationId: string,
    userMessage: string,
    aiResponse: string,
    clientPhone?: string
  ) {
    try {
      // Guardar mensaje del usuario
      await this.prisma.chatHistory.create({
        data: {
          tenantId,
          clientPhone: clientPhone || conversationId,
          direction: "INCOMING",
          message: userMessage,
        },
      });

      // Guardar respuesta de IA
      await this.prisma.chatHistory.create({
        data: {
          tenantId,
          clientPhone: clientPhone || conversationId,
          direction: "OUTGOING",
          message: aiResponse,
        },
      });
    } catch (error) {
      console.error("Error guardando historial:", error);
      // No lanzar error aquí para no interrumpir la respuesta
    }
  }

  private generateConversationId(): string {
    return `conv-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
} 