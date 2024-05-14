import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
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

    return (
        <View style={styles.container}>
            {categoryDetails.map((details, index) => (
                <View key={index} style={styles.prediction}>
                    <Text style={styles.text}>
                        {details.class}: {details.count}/{details.total} ({details.percentage}%)
                    </Text>
                </View>
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
    },
    prediction: {
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        borderRadius: 10,
        padding: 8,
        margin: 5,
    },
    text: {
        color: 'white',
        fontSize: 16,
    },
});

export default PredictionTags;