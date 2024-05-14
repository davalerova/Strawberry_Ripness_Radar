import { API_URL } from '../../config/api/tesloApi';
import type { Product, Prediction as DomainPrediction } from '../../domain/entities/product';
import type { TesloProduct, Prediction as ApiPrediction } from '../interfaces/teslo-products.response';

export class ProductMapper {
  static tesloProductToEntity(tesloProduct: TesloProduct): Product {
    return {
      id: String(tesloProduct.id),
      title: tesloProduct.title,
      price: tesloProduct.price,
      description: tesloProduct.description,
      slug: tesloProduct.slug,
      stock: tesloProduct.stock,
      sizes: tesloProduct.sizes,
      gender: tesloProduct.gender,
      tags: tesloProduct.tags,
      images: tesloProduct.images.map(image => `${API_URL}/files/product/${image}`),
      predictions: tesloProduct.predictions.map(p => ProductMapper.transformPrediction(p))
    };
  }

  static transformPrediction(apiPrediction: ApiPrediction): DomainPrediction {
    return {
      ...apiPrediction,
      class_name: apiPrediction.class_name // Asegúrate de asignar class_name a class aquí
    };
  }
}