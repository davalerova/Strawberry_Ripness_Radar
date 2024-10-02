import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Layout, useTheme, CircularProgressBar } from '@ui-kitten/components';
import { BarChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';
import { Prediction } from '../../../domain/entities/product';

interface Props {
    predictions: Prediction[];
}

interface CategoryDetails {
    class: string;
    averageConfidence: number;
    percentage: number;
    count: number;
    total: number;
}

const PredictionTags: React.FC<Props> = ({ predictions }) => {
    const theme = useTheme();

    // Función para calcular los porcentajes, conteo y confianza promedio de cada categoría
    const getCategoryDetails = (): CategoryDetails[] => {
        const total = predictions.length;
        const detailsByClass = predictions.reduce<Record<string, { count: number; totalConfidence: number }>>((acc, pred) => {
            const className = pred.class_name;
            const confidence = pred.confidence;
            if (!acc[className]) {
                acc[className] = { count: 0, totalConfidence: 0 };
            }
            acc[className].count += 1;
            acc[className].totalConfidence += confidence;
            return acc;
        }, {});

        return Object.entries(detailsByClass).map(([cls, details]) => ({
            class: cls,
            averageConfidence: (details.totalConfidence / details.count) * 100,
            percentage: Math.round((details.count / total) * 100),
            count: details.count,
            total: total,
        }));
    };

    const categoryDetails = getCategoryDetails();

    const getColor = (className: string) => {
        switch (className) {
            case 'madura':
                return theme['color-danger-500'];
            case 'pintona':
                return theme['color-warning-400'];
            case 'inmadura':
                return theme['color-success-500'];
            case 'podrida':
                return theme['color-danger-800'];
            case 'flor':
                return theme['color-info-500'];
            default:
                return theme['color-basic-400'];
        }
    };

    // Datos para la gráfica
    const chartData = {
        labels: categoryDetails.map(details => details.class.toUpperCase()),
        datasets: [
            {
                data: categoryDetails.map(details => details.averageConfidence),
            },
        ],
    };

    const overallConfidence = (predictions.reduce((sum, pred) => sum + pred.confidence, 0) / predictions.length) * 100;

    return (
        <ScrollView>
            {predictions.length > 0 ? (
                <>
                    <Layout style={styles.container} level='1'>
                        {categoryDetails.map((details, index) => (
                            <View key={index} style={styles.card}>
                                <Text style={[styles.text, { color: getColor(details.class) }]}>
                                    {details.class.toUpperCase()}
                                </Text>
                                <CircularProgressBar
                                    progress={details.percentage / 100}
                                    status={
                                        details.class === 'madura'
                                            ? 'danger' : details.class === 'pintona'
                                                ? 'warning' : details.class === 'inmadura'
                                                    ? 'success' : details.class === 'podrida'
                                                        ? 'danger' : details.class === 'flor'
                                                            ? 'info' : 'color-basic-400'
                                    }
                                    style={{ marginVertical: 10 }}
                                />
                                <Text style={[styles.text, { color: getColor(details.class) }]}>{`${details.count}/${details.total}`}</Text>
                            </View>
                        ))}
                    </Layout>
                    <Text style={styles.chartTitle}>Confianza Promedio por Categoría</Text>
                    <View style={styles.chartContainer}>
                        <BarChart
                            data={chartData}
                            width={Dimensions.get('window').width - 16}
                            height={220}

                            yAxisLabel=""
                            yAxisSuffix="%"
                            yAxisInterval={1} // opcional, control del intervalo de las marcas del eje Y
                            fromZero={true}
                            chartConfig={{
                                backgroundColor: theme['color-basic-100'],
                                backgroundGradientFrom: theme['color-basic-100'],
                                backgroundGradientTo: theme['color-basic-100'],
                                decimalPlaces: 0,
                                color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                                labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                                style: {
                                    borderRadius: 16,
                                },
                                propsForDots: {
                                    r: "6",
                                    strokeWidth: "2",
                                    stroke: "#ffa726",
                                },
                            }}
                            style={{
                                marginVertical: 8,
                                borderRadius: 16,
                            }}
                        />
                    </View>
                    <Text style={[styles.summaryText, { color: theme['color-primary-500'] }]}>
                        {predictions.length === 1 ? `Se encontró una inferencia con una confianza del ${overallConfidence.toFixed(0)}%.` : `Se encontró un total de ${predictions.length} inferencias con una confianza del ${overallConfidence.toFixed(0)}%.`}
                    </Text>
                </>
            ) : (
                <>
                    <Text style={[styles.summaryText, { color: theme['color-primary-500'] }]}>
                        No hay inferencias.
                    </Text>

                </>
            )}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        flexWrap: 'wrap',
        marginTop: 10,
    },
    card: {
        width: 100,
        margin: 5,
        alignItems: 'center',
        padding: 10,
        borderRadius: 10,
        backgroundColor: '#f7f9fc',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.23,
        shadowRadius: 2.62,
        elevation: 4,
    },
    text: {
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    summaryText: {
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
        margin: 10,
    },
    noDataText: {
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
        margin: 20,
        color: '#F95F6B',
    },
    chartContainer: {
        alignItems: 'center',
        marginVertical: 20,
    },
    chartTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 10,
    },
});

export default PredictionTags;
