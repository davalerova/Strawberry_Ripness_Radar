import { isAxiosError } from 'axios';
import { tesloApi } from '../../config/api/tesloApi';
import { Prediction, Product } from '../../domain/entities/product';

export const updateCreateProduct = (product: Partial<Product>) => {
  product.stock = isNaN(Number(product.stock)) ? 0 : Number(product.stock);
  product.price = isNaN(Number(product.price)) ? 0 : Number(product.price);

  return product.id && product.id !== 'new' ? updateProduct(product) : createProduct(product);
}

const prepareImages = async (images: string[]) => {
  const uploads = images.map(image => image.includes('file://') ? uploadImage(image) : Promise.resolve({ image, predictions: [] }));
  return Promise.all(uploads);
}

const uploadImage = async (image: string) => {
  const formData = new FormData();
  formData.append('image', { uri: image, type: 'image/jpeg', name: image.split('/').pop() });

  try {
    const { data } = await tesloApi.post<{ image: string, predictions: Prediction[] }>('/files/product', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    console.info(data.predictions)
    return { image: data.image, predictions: data.predictions };
  } catch (error) {
    console.error('Upload image failed:', error);
    throw new Error('Failed to upload image');
  }
}

const updateProduct = async (product: Partial<Product>) => {
  try {
    const imageResults = await prepareImages(product.images || []);
    const { data } = await tesloApi.patch(`/products/${product.id}`, {
      ...product,
      images: imageResults.map(img => `${img.image}`),
      predictions: imageResults.flatMap(img => img.predictions)
    });
    return data;
  } catch (error) {
    if (isAxiosError(error)) console.error('API error:', error.response?.data);
    throw new Error('Error updating product');
  }
}

const createProduct = async (product: Partial<Product>) => {
  try {
    const imageResults = await prepareImages(product.images || []);
    const { data } = await tesloApi.post(`/products/`, {
      ...product,
      images: imageResults.map(img => `prediction_${img.image}`),
      predictions: imageResults.flatMap(img => img.predictions)
    });
    return data;
  } catch (error) {
    if (isAxiosError(error)) console.error('API error:', error.response?.data);
    throw new Error('Error creating product');
  }
}
