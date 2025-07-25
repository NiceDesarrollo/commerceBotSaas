import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { QueryProductsDto, UpdateStockDto } from './dto/query-products.dto';
export declare class ProductsService {
    private prisma;
    constructor(prisma: PrismaService);
    create(createProductDto: CreateProductDto, tenantId: string): Promise<{
        tenant: {
            id: string;
            name: string;
            slug: string;
        };
    } & {
        tenantId: string;
        id: string;
        name: string;
        createdAt: Date;
        description: string | null;
        price: number;
        category: string | null;
        imageUrl: string | null;
        stock: number;
        tags: string[];
    }>;
    findAll(queryDto: QueryProductsDto, tenantId: string): Promise<{
        products: ({
            tenant: {
                id: string;
                name: string;
                slug: string;
            };
        } & {
            tenantId: string;
            id: string;
            name: string;
            createdAt: Date;
            description: string | null;
            price: number;
            category: string | null;
            imageUrl: string | null;
            stock: number;
            tags: string[];
        })[];
        pagination: {
            page: number;
            limit: number;
            totalCount: number;
            totalPages: number;
            hasNextPage: boolean;
            hasPreviousPage: boolean;
        };
    }>;
    findOne(id: string, tenantId: string): Promise<{
        tenant: {
            id: string;
            name: string;
            slug: string;
        };
    } & {
        tenantId: string;
        id: string;
        name: string;
        createdAt: Date;
        description: string | null;
        price: number;
        category: string | null;
        imageUrl: string | null;
        stock: number;
        tags: string[];
    }>;
    update(id: string, updateProductDto: UpdateProductDto, tenantId: string): Promise<{
        tenant: {
            id: string;
            name: string;
            slug: string;
        };
    } & {
        tenantId: string;
        id: string;
        name: string;
        createdAt: Date;
        description: string | null;
        price: number;
        category: string | null;
        imageUrl: string | null;
        stock: number;
        tags: string[];
    }>;
    remove(id: string, tenantId: string): Promise<{
        message: string;
    }>;
    updateStock(id: string, updateStockDto: UpdateStockDto, tenantId: string): Promise<{
        tenant: {
            id: string;
            name: string;
            slug: string;
        };
    } & {
        tenantId: string;
        id: string;
        name: string;
        createdAt: Date;
        description: string | null;
        price: number;
        category: string | null;
        imageUrl: string | null;
        stock: number;
        tags: string[];
    }>;
    findLowStock(threshold: number, tenantId: string): Promise<{
        products: ({
            tenant: {
                id: string;
                name: string;
                slug: string;
            };
        } & {
            tenantId: string;
            id: string;
            name: string;
            createdAt: Date;
            description: string | null;
            price: number;
            category: string | null;
            imageUrl: string | null;
            stock: number;
            tags: string[];
        })[];
        threshold: number;
        count: number;
    }>;
    search(query: string, tenantId: string): Promise<{
        products: ({
            tenant: {
                id: string;
                name: string;
                slug: string;
            };
        } & {
            tenantId: string;
            id: string;
            name: string;
            createdAt: Date;
            description: string | null;
            price: number;
            category: string | null;
            imageUrl: string | null;
            stock: number;
            tags: string[];
        })[];
        query: string;
        count: number;
    }>;
    getCategories(tenantId: string): Promise<{
        categories: string[];
        count: number;
    }>;
}
