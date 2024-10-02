import { useRef } from 'react';
import {
  ButtonGroup,
  Input,
  Layout,
  Button,
  useTheme,
  Text,
} from '@ui-kitten/components';
import { Formik } from 'formik';

import { MainLayout } from '../../layouts/MainLayout';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParams } from '../../navigation/StackNavigator';

import { getProductById, updateCreateProduct } from '../../../actions/products';

import { ScrollView } from 'react-native-gesture-handler';
import { Product } from '../../../domain/entities/product';
import { MyIcon } from '../../components/ui/MyIcon';

import { ProductImages } from '../../components/products/ProductImages';
import { genders, sizes } from '../../../config/constants/constants';
import { CameraAdapter } from '../../../config/adapters/camera-adapter';
import PredictionTags from '../../components/products/PredictionTags';

interface Props extends StackScreenProps<RootStackParams, 'ProductScreen'> { }

export const ProductScreen = ({ route }: Props) => {
  const productIdRef = useRef(route.params.productId);
  const theme = useTheme();
  const queryClient = useQueryClient();

  const { data: product } = useQuery({
    queryKey: ['product', productIdRef.current],
    queryFn: () => getProductById(productIdRef.current),
  });

  const mutation = useMutation({
    mutationFn: (data: Product) =>
      updateCreateProduct({ ...data, id: productIdRef.current }),
    onSuccess(data: Product) {
      productIdRef.current = data.id; // creación

      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['product', data.id] });
      // queryClient.setQueryData(['product',  data.id ], data);
    },
  });

  if (!product) {
    return <MainLayout title="Cargando..." />;
  }

  return (
    <Formik initialValues={product} onSubmit={mutation.mutate}>
      {({ handleChange, handleSubmit, values, errors, setFieldValue }) => (
        <MainLayout
          title={values.title}
          rightAction={(productIdRef.current === 'new' && values.images.length === 0) ? async () => {
            const photos = await CameraAdapter.getPicturesFromLibrary();
            setFieldValue('images', [...values.images, ...photos]);
          } : undefined}
          rightActionIcon={(productIdRef.current === 'new' && values.images.length === 0) ? "image-outline" : undefined}
        >
          <ScrollView style={{ flex: 1 }}>
            {/* Imágenes de el producto */}
            <Layout
              style={{
                marginVertical: 10,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <ProductImages images={values.images} />
              <PredictionTags predictions={values.predictions} />
            </Layout>

            {/* Aquí continúa el resto del formulario */}

            {/* Botón de guardar o inferir */}
            {productIdRef.current === 'new' && (
              <>
                <Text style={{
                  fontSize: 20,
                  fontWeight: 'bold',
                  marginBottom: 10,
                  textAlign: 'center',
                  color: theme['color-primary-500']
                }}>{values.images.length === 0 ? `Pulsa el ícono de la imagen para seleccionar una fotografía, luego pulsa el botón Inferir para continuar.` : `Pulsa  el botón Inferir para continuar.`}</Text>
                <Button
                  accessoryLeft={<MyIcon name="save-outline" white />}
                  onPress={() => handleSubmit()}
                  disabled={mutation.isPending || values.images.length === 0}
                  style={{ margin: 15 }}>
                  Inferir
                </Button>
              </>
            )}

            <Layout style={{ height: 100 }} />
          </ScrollView>
        </MainLayout>
      )}
    </Formik>
  );
};
