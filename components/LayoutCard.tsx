import { StyleSheet, View } from 'react-native';

export default function LayoutCard({ children }: { children: React.ReactNode }) {
    return (
        <View
            style={styles.card}
        >
            {children}
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#fff',
        borderRadius: 10,
        elevation: 3, // For Android shadow
        shadowColor: '#000', // For iOS shadow
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        margin: 10,
        overflow: 'hidden',
        height: 400,
        width: '90%', // Optional: adjust width
    },
})