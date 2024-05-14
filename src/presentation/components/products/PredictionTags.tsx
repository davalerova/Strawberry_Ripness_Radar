import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Layout, Card, useTheme, CircularProgressBar } from '@ui-kitten/components';
import { Prediction } from '../../../domain/entities/product';

interface Props {
    predictions: Prediction[];
}

interface CategoryDetails {
    class: string;
    percentage: number;
    count: number;
    total: number;
}

const PredictionTags: React.FC<Props> = ({ predictions }) => {
    const theme = useTheme();

    // Función para calcular los porcentajes y el conteo de cada categoría
    const getCategoryDetails = (): CategoryDetails[] => {
        const total = predictions.length;
        const countByClass = predictions.reduce<Record<string, number>>((acc, pred) => {
            const className = pred.class_name;
            acc[className] = (acc[className] || 0) + 1;
            return acc;
        }, {});

        return Object.entries(countByClass).map(([cls, count]) => ({
            class: cls,
            percentage: Math.round((count / total) * 100),
            count: count,
            total: total
        }));
    };

    const categoryDetails = getCategoryDetails();

    const getColor = (className: string) => {
        switch (className) {
            case 'madura':
                return theme['color-danger-400'];
            case 'pintona':
                return theme['color-warning-400'];
            case 'inmadura':
                return theme['color-success-400'];
            case 'podrida':
                return theme['color-info-400'];
            case 'flor':
                return theme['color-primary-400'];
            default:
                return theme['color-basic-400'];
        }
    };

    return (
        <Layout style={styles.container} level='1'>
            {categoryDetails.map((details, index) => (
                <View key={index} style={styles.card}>
                    <Text style={[styles.text, { color: getColor(details.class) }]}>
                        {details.class}
                    </Text>
                    <CircularProgressBar
                        progress={details.percentage / 100}
                        status={
                            details.class === 'madura'
                                ? 'danger' : details.class === 'pintona'
                                    ? 'warning' : details.class === 'inmadura'
                                        ? 'success' : details.class === 'podrida'
                                            ? 'info' : 'primary'
                        }
                        style={{ marginVertical: 10 }}
                    />
                    <Text style={[styles.text, { color: getColor(details.class) }]}>{`${details.count}/${details.total}`}</Text>
                </View>
            ))}
        </Layout>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
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
        backgroundColor: '#f7f9fc',  // Fondo del card
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
    },
    percentageText: {
        fontSize: 14,
        color: '#333',
    },
});

export default PredictionTags;