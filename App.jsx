import {
    StatusBar,
    StyleSheet,
    useColorScheme,
    View,
    Button,
    Linking
} from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

function App() {
    const isDarkMode = useColorScheme() === 'dark';

    return (
        <SafeAreaProvider>
            <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
            <AppContent />
        </SafeAreaProvider>
    );
}

function AppContent() {
    const openLink = () => {
        Linking.openURL('https://google.com');
    };

    return (
        <View style={styles.container}>
            <Button title="Open Chrome" onPress={openLink} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});

export default App;