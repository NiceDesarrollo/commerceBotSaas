import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { QueryProductsDto, UpdateStockDto } from './dto/query-products.dto';
import { UserFromToken } from '../auth/decorators/user.decorator';
export declare class ProductsController {
    private readonly productsService;
    constructor(productsService: ProductsService);
    create(createProductDto: CreateProductDto, user: UserFromToken): Promise<{
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
    findAll(queryDto: QueryProductsDto, user: UserFromToken): Promise<{
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
    search(query: string, user: UserFromToken): Promise<{
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
    getCategories(user: UserFromToken): Promise<{
        categories: string[];
        count: number;
    }>;
    findLowStock(threshold: number, user: UserFromToken): Promise<{
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
    findOne(id: string, user: UserFromToken): Promise<{
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
    update(id: string, updateProductDto: UpdateProductDto, user: UserFromToken): Promise<{
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
    updateStock(id: string, updateStockDto: UpdateStockDto, user: UserFromToken): Promise<{
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
    remove(id: string, user: UserFromToken): Promise<{
        message: string;
    }>;
}
