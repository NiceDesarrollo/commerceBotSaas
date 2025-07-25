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
exports.ProductsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let ProductsService = class ProductsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(createProductDto, tenantId) {
        try {
            const product = await this.prisma.product.create({
                data: {
                    ...createProductDto,
                    tenantId,
                    tags: createProductDto.tags || [],
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
            return product;
        }
        catch (error) {
            throw new common_1.ConflictException('Error al crear el producto');
        }
    }
    async findAll(queryDto, tenantId) {
        const { search, category, minPrice, maxPrice, minStock, tags, sortBy = 'createdAt', sortOrder = 'desc', page = 1, limit = 10, } = queryDto;
        const where = {
            tenantId,
        };
        if (search) {
            where.OR = [
                { name: { contains: search, mode: 'insensitive' } },
                { description: { contains: search, mode: 'insensitive' } },
            ];
        }
        if (category) {
            where.category = { contains: category, mode: 'insensitive' };
        }
        if (minPrice !== undefined) {
            where.price = { ...where.price, gte: minPrice };
        }
        if (maxPrice !== undefined) {
            where.price = { ...where.price, lte: maxPrice };
        }
        if (minStock !== undefined) {
            where.stock = { gte: minStock };
        }
        if (tags) {
            const tagList = tags.split(',').map(tag => tag.trim());
            where.tags = {
                hasSome: tagList,
            };
        }
        const offset = (page - 1) * limit;
        const orderBy = {};
        orderBy[sortBy] = sortOrder;
        try {
            const [products, totalCount] = await Promise.all([
                this.prisma.product.findMany({
                    where,
                    orderBy,
                    skip: offset,
                    take: limit,
                    include: {
                        tenant: {
                            select: {
                                id: true,
                                name: true,
                                slug: true,
                            },
                        },
                    },
                }),
                this.prisma.product.count({ where }),
            ]);
            const totalPages = Math.ceil(totalCount / limit);
            return {
                products,
                pagination: {
                    page,
                    limit,
                    totalCount,
                    totalPages,
                    hasNextPage: page < totalPages,
                    hasPreviousPage: page > 1,
                },
            };
        }
        catch (error) {
            throw new common_1.BadRequestException('Error al obtener productos');
        }
    }
    async findOne(id, tenantId) {
        const product = await this.prisma.product.findFirst({
            where: {
                id,
                tenantId,
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
        if (!product) {
            throw new common_1.NotFoundException('Producto no encontrado');
        }
        return product;
    }
    async update(id, updateProductDto, tenantId) {
        await this.findOne(id, tenantId);
        try {
            const updatedProduct = await this.prisma.product.update({
                where: {
                    id,
                },
                data: updateProductDto,
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
            return updatedProduct;
        }
        catch (error) {
            throw new common_1.ConflictException('Error al actualizar el producto');
        }
    }
    async remove(id, tenantId) {
        await this.findOne(id, tenantId);
        try {
            await this.prisma.product.delete({
                where: {
                    id,
                },
            });
            return { message: 'Producto eliminado exitosamente' };
        }
        catch (error) {
            throw new common_1.ConflictException('Error al eliminar el producto');
        }
    }
    async updateStock(id, updateStockDto, tenantId) {
        const product = await this.findOne(id, tenantId);
        const { stock, operation } = updateStockDto;
        let newStock;
        switch (operation) {
            case 'set':
                newStock = stock;
                break;
            case 'add':
                newStock = product.stock + stock;
                break;
            case 'subtract':
                newStock = product.stock - stock;
                if (newStock < 0) {
                    throw new common_1.BadRequestException('El stock no puede ser negativo');
                }
                break;
            default:
                newStock = stock;
        }
        try {
            const updatedProduct = await this.prisma.product.update({
                where: {
                    id,
                },
                data: {
                    stock: newStock,
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
            return updatedProduct;
        }
        catch (error) {
            throw new common_1.ConflictException('Error al actualizar el stock');
        }
    }
    async findLowStock(threshold = 10, tenantId) {
        try {
            const products = await this.prisma.product.findMany({
                where: {
                    tenantId,
                    stock: {
                        lte: threshold,
                    },
                },
                orderBy: {
                    stock: 'asc',
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
            return {
                products,
                threshold,
                count: products.length,
            };
        }
        catch (error) {
            throw new common_1.BadRequestException('Error al obtener productos con stock bajo');
        }
    }
    async search(query, tenantId) {
        try {
            const products = await this.prisma.product.findMany({
                where: {
                    tenantId,
                    OR: [
                        { name: { contains: query, mode: 'insensitive' } },
                        { description: { contains: query, mode: 'insensitive' } },
                        { category: { contains: query, mode: 'insensitive' } },
                        { tags: { hasSome: [query] } },
                    ],
                },
                orderBy: {
                    name: 'asc',
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
            return {
                products,
                query,
                count: products.length,
            };
        }
        catch (error) {
            throw new common_1.BadRequestException('Error al buscar productos');
        }
    }
    async getCategories(tenantId) {
        try {
            const categories = await this.prisma.product.findMany({
                where: {
                    tenantId,
                    category: {
                        not: null,
                    },
                },
                select: {
                    category: true,
                },
                distinct: ['category'],
                orderBy: {
                    category: 'asc',
                },
            });
            const categoryList = categories
                .map(item => item.category)
                .filter(Boolean);
            return {
                categories: categoryList,
                count: categoryList.length,
            };
        }
        catch (error) {
            throw new common_1.BadRequestException('Error al obtener categorías');
        }
    }
};
exports.ProductsService = ProductsService;
exports.ProductsService = ProductsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ProductsService);
//# sourceMappingURL=products.service.js.map