"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AiService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const prisma_service_1 = require("../prisma/prisma.service");
const ai_provider_service_1 = require("./services/ai-provider.service");
let AiService = class AiService {
    constructor(prisma, configService, aiProviderService) {
        this.prisma = prisma;
        this.configService = configService;
        this.aiProviderService = aiProviderService;
    }
    async getBotConfig(tenantId) {
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
            if (!botConfig) {
                botConfig = await this.prisma.botConfig.create({
                    data: {
                        tenantId,
                        botName: "Asistente IA",
                        promptStyle: "Amable, clara y persuasiva",
                        greeting: "Hola, soy tu asistente virtual. ¿En qué puedo ayudarte hoy?",
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
        }
        catch (error) {
            throw new common_1.BadRequestException("Error al obtener la configuración del bot");
        }
    }
    async updateBotConfig(tenantId, updateDto) {
        try {
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
        }
        catch (error) {
            if (error instanceof common_1.BadRequestException) {
                throw error;
            }
            throw new common_1.BadRequestException("Error al actualizar la configuración del bot");
        }
    }
    async sendMessage(tenantId, chatDto) {
        try {
            const botConfig = await this.getBotConfig(tenantId);
            const products = await this.getProductsContext(tenantId);
            const tenant = await this.prisma.tenant.findUnique({
                where: { id: tenantId },
                select: { name: true, slug: true },
            });
            const systemPrompt = this.buildSystemPrompt(botConfig, tenant, products);
            let conversationHistory = "";
            if (chatDto.conversationId) {
                conversationHistory = await this.getConversationHistory(chatDto.conversationId, tenantId);
            }
            const fullMessage = `${systemPrompt}\n\nHistorial de conversación:\n${conversationHistory}\n\nUsuario: ${chatDto.message}\n\nAsistente:`;
            const aiConfig = {
                temperature: botConfig.temperature,
                model: botConfig.aiModel || undefined,
            };
            const aiResult = await this.aiProviderService.generateResponse(fullMessage, aiConfig);
            const conversationId = chatDto.conversationId || this.generateConversationId();
            await this.saveConversationHistory(tenantId, conversationId, chatDto.message, aiResult.text, chatDto.clientPhone);
            return {
                response: aiResult.text,
                conversationId,
                timestamp: new Date(),
                tokensUsed: aiResult.tokensUsed,
                model: aiResult.model,
                provider: aiResult.provider,
            };
        }
        catch (error) {
            console.error("Error en IA:", error);
            throw new common_1.InternalServerErrorException("Error al procesar el mensaje con IA");
        }
    }
    async testBotConfig(tenantId, testDto) {
        const chatDto = {
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
    async getConversations(tenantId, limit = 50) {
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
            const groupedConversations = conversations.reduce((acc, msg) => {
                const key = msg.clientPhone || "general";
                if (!acc[key]) {
                    acc[key] = [];
                }
                acc[key].push(msg);
                return acc;
            }, {});
            return {
                conversations: groupedConversations,
                totalMessages: conversations.length,
                clients: Object.keys(groupedConversations).length,
            };
        }
        catch (error) {
            throw new common_1.BadRequestException("Error al obtener conversaciones");
        }
    }
    buildSystemPrompt(botConfig, tenant, products) {
        const productsContext = products.length > 0
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
    async getProductsContext(tenantId) {
        try {
            return await this.prisma.product.findMany({
                where: {
                    tenantId,
                    stock: { gt: 0 },
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
                take: 20,
                orderBy: { createdAt: "desc" },
            });
        }
        catch (error) {
            console.error("Error obteniendo productos para contexto:", error);
            return [];
        }
    }
    async getConversationHistory(conversationId, tenantId) {
        try {
            const history = await this.prisma.chatHistory.findMany({
                where: {
                    tenantId,
                    clientPhone: conversationId,
                },
                orderBy: { timestamp: "asc" },
                take: 10,
                select: {
                    direction: true,
                    message: true,
                    timestamp: true,
                },
            });
            return history
                .map((h) => `${h.direction === "INCOMING" ? "Usuario" : "Asistente"}: ${h.message}`)
                .join("\n");
        }
        catch (error) {
            console.error("Error obteniendo historial:", error);
            return "";
        }
    }
    async saveConversationHistory(tenantId, conversationId, userMessage, aiResponse, clientPhone) {
        try {
            await this.prisma.chatHistory.create({
                data: {
                    tenantId,
                    clientPhone: clientPhone || conversationId,
                    direction: "INCOMING",
                    message: userMessage,
                },
            });
            await this.prisma.chatHistory.create({
                data: {
                    tenantId,
                    clientPhone: clientPhone || conversationId,
                    direction: "OUTGOING",
                    message: aiResponse,
                },
            });
        }
        catch (error) {
            console.error("Error guardando historial:", error);
        }
    }
    generateConversationId() {
        return `conv-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }
};
exports.AiService = AiService;
exports.AiService = AiService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        config_1.ConfigService,
        ai_provider_service_1.AiProviderService])
], AiService);
//# sourceMappingURL=ai.service.js.map