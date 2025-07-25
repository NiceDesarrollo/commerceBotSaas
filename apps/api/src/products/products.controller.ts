import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Patch, 
  Param, 
  Delete, 
  Query, 
  Put,
  HttpCode,
  HttpStatus,
  UseGuards,
  ParseIntPipe,
  DefaultValuePipe,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { QueryProductsDto, UpdateStockDto } from './dto/query-products.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { User, UserFromToken } from '../auth/decorators/user.decorator';

@Controller('products')
@UseGuards(JwtAuthGuard)
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() createProductDto: CreateProductDto,
    @User() user: UserFromToken,
  ) {
    return this.productsService.create(createProductDto, user.tenantId);
  }

  @Get()
  async findAll(
    @Query() queryDto: QueryProductsDto,
    @User() user: UserFromToken,
  ) {
    return this.productsService.findAll(queryDto, user.tenantId);
  }

  @Get('search')
  async search(
    @Query('q') query: string,
    @User() user: UserFromToken,
  ) {
    if (!query) {
      return { products: [], query: '', count: 0 };
    }
    return this.productsService.search(query, user.tenantId);
  }

  @Get('categories')
  async getCategories(@User() user: UserFromToken) {
    return this.productsService.getCategories(user.tenantId);
  }

  @Get('low-stock')
  async findLowStock(
    @Query('threshold', new DefaultValuePipe(10), ParseIntPipe) threshold: number,
    @User() user: UserFromToken,
  ) {
    return this.productsService.findLowStock(threshold, user.tenantId);
  }

  @Get(':id')
  async findOne(
    @Param('id') id: string,
    @User() user: UserFromToken,
  ) {
    return this.productsService.findOne(id, user.tenantId);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
    @User() user: UserFromToken,
  ) {
    return this.productsService.update(id, updateProductDto, user.tenantId);
  }

  @Patch(':id/stock')
  async updateStock(
    @Param('id') id: string,
    @Body() updateStockDto: UpdateStockDto,
    @User() user: UserFromToken,
  ) {
    return this.productsService.updateStock(id, updateStockDto, user.tenantId);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async remove(
    @Param('id') id: string,
    @User() user: UserFromToken,
  ) {
    return this.productsService.remove(id, user.tenantId);
  }
} 