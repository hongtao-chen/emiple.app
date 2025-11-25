import { SafeAreaProvider } from 'react-native-safe-area-context';
import {
    StatusBar,
    StyleSheet,
    useColorScheme,
    View,
    Linking
} from 'react-native';
import {
    PaperProvider,
    MD3DarkTheme,
    MD3LightTheme,
    Text,
    Button,
    useTheme
} from 'react-native-paper';

function App() {
    const isDarkMode = useColorScheme() === 'dark';
    const paperTheme = isDarkMode ? MD3DarkTheme : MD3LightTheme;

    return (
        <SafeAreaProvider>
            <PaperProvider theme={paperTheme}>
                <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
                <AppContent />
            </PaperProvider>
        </SafeAreaProvider>
    );
}

function AppContent() {
    const theme = useTheme();

    const openLink = () => {
        Linking.openURL('https://google.com');
    };

    return (
        <View style={[
            styles.container,
            { backgroundColor: theme.colors.background }
        ]}>
            <Text variant="titleLarge">Card Title</Text>

            <Text variant="bodyMedium">
              This text now adapts to system settings.
            </Text>

            <Button mode="contained" onPress={openLink}>Paper Button</Button>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    }
});

export default App;