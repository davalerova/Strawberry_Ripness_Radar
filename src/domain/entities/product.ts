

export interface Prediction {
  x: number;
  y: number;
  width: number;
  height: number;
  confidence: number;
  class_name: ClassName; // Asegúrate de importar ClassName si está en otro archivo
  class_id: number;
  detection_id: string;
  image_path: string;
  prediction_type: PredictionType; // Asegúrate de importar PredictionType si está en otro archivo
}

export interface Product {
  id: string;
  title: string;
  price: number;
  description: string;
  slug: string;
  stock: number;
  sizes: Size[];
  gender: Gender;
  tags: string[];
  images: string[];
  predictions: Prediction[];  // Nuevo campo para almacenar las predicciones
}

export enum Gender {
  Kid = "kid",
  Men = "men",
  Unisex = "unisex",
  Women = "women",
}

export enum Size {
  L = "L",
  M = "M",
  S = "S",
  Xl = "XL",
  Xs = "XS",
  Xxl = "XXL",
}




export enum ClassName {
  Flor = "flor",
  Inmadura = "inmadura",
  Madura = "madura",
  Pintona = "pintona",
  Podrida = "podrida",
}

export enum PredictionType {
  ObjectDetectionModel = "ObjectDetectionModel",
}