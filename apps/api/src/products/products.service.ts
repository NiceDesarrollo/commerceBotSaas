import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { QueryProductsDto, UpdateStockDto } from './dto/query-products.dto';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  // Crear producto
  async create(createProductDto: CreateProductDto, tenantId: string) {
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
    } catch (error) {
      throw new ConflictException('Error al crear el producto');
    }
  }

  // Listar productos con filtros y paginación
  async findAll(queryDto: QueryProductsDto, tenantId: string) {
    const {
      search,
      category,
      minPrice,
      maxPrice,
      minStock,
      tags,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      page = 1,
      limit = 10,
    } = queryDto;

    // Construir filtros
    const where: any = {
      tenantId,
    };

    // Búsqueda por nombre o descripción
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    // Filtro por categoría
    if (category) {
      where.category = { contains: category, mode: 'insensitive' };
    }

    // Filtro por rango de precio
    if (minPrice !== undefined) {
      where.price = { ...where.price, gte: minPrice };
    }
    if (maxPrice !== undefined) {
      where.price = { ...where.price, lte: maxPrice };
    }

    // Filtro por stock mínimo
    if (minStock !== undefined) {
      where.stock = { gte: minStock };
    }

    // Filtro por tags
    if (tags) {
      const tagList = tags.split(',').map(tag => tag.trim());
      where.tags = {
        hasSome: tagList,
      };
    }

    // Calcular offset para paginación
    const offset = (page - 1) * limit;

    // Configurar ordenamiento
    const orderBy: any = {};
    orderBy[sortBy] = sortOrder;

    try {
      // Obtener productos y total count en paralelo
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
    } catch (error) {
      throw new BadRequestException('Error al obtener productos');
    }
  }

  // Obtener producto por ID
  async findOne(id: string, tenantId: string) {
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
      throw new NotFoundException('Producto no encontrado');
    }

    return product;
  }

  // Actualizar producto
  async update(id: string, updateProductDto: UpdateProductDto, tenantId: string) {
    // Verificar que el producto existe y pertenece al tenant
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
    } catch (error) {
      throw new ConflictException('Error al actualizar el producto');
    }
  }

  // Eliminar producto
  async remove(id: string, tenantId: string) {
    // Verificar que el producto existe y pertenece al tenant
    await this.findOne(id, tenantId);

    try {
      await this.prisma.product.delete({
        where: {
          id,
        },
      });

      return { message: 'Producto eliminado exitosamente' };
    } catch (error) {
      throw new ConflictException('Error al eliminar el producto');
    }
  }

  // Actualizar stock específicamente
  async updateStock(id: string, updateStockDto: UpdateStockDto, tenantId: string) {
    const product = await this.findOne(id, tenantId);
    const { stock, operation } = updateStockDto;
    
    let newStock: number;

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
          throw new BadRequestException('El stock no puede ser negativo');
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
    } catch (error) {
      throw new ConflictException('Error al actualizar el stock');
    }
  }

  // Obtener productos con stock bajo
  async findLowStock(threshold: number = 10, tenantId: string) {
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
    } catch (error) {
      throw new BadRequestException('Error al obtener productos con stock bajo');
    }
  }

  // Buscar productos por nombre
  async search(query: string, tenantId: string) {
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
    } catch (error) {
      throw new BadRequestException('Error al buscar productos');
    }
  }

  // Obtener todas las categorías únicas del tenant
  async getCategories(tenantId: string) {
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
    } catch (error) {
      throw new BadRequestException('Error al obtener categorías');
    }
  }
} 