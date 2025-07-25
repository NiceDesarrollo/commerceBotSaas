export declare class QueryProductsDto {
    search?: string;
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    minStock?: number;
    tags?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    page?: number;
    limit?: number;
}
export declare class UpdateStockDto {
    stock: number;
    operation?: 'set' | 'add' | 'subtract';
}
