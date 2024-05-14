import { tesloApi } from '../../config/api/tesloApi';
import type { Product } from '../../domain/entities/product';
import type { TesloProduct } from '../../infrastructure/interfaces/teslo-products.response';
import { ProductMapper } from '../../infrastructure/mappers/product.mapper';

export const getProductsByPage = async (page: number, limit: number = 2000): Promise<Product[]> => {


  // console.log({page, limit});

  try {

    const { data } = await tesloApi.get<{ data: TesloProduct[] }>(`/products/?offset=${page * limit}&limit=${limit}`);


    const products = data.data.map(ProductMapper.tesloProductToEntity);
    return products;

  } catch (error) {
    console.log(error);
    throw new Error('Error getting products');

  }
};
