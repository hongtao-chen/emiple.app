import { useColorScheme } from 'react-native';
import { NavigationContainer, DarkTheme as NavigationDarkTheme, DefaultTheme as NavigationDefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Provider as PaperProvider, MD3DarkTheme, MD3LightTheme, adaptNavigationTheme, IconButton } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import AuthScreen from './screens/AuthScreen';
import ProfileScreen from './screens/ProfileScreen';
import AnalysisScreen from './screens/AnalysisScreen';

const Stack = createNativeStackNavigator();

const { LightTheme, DarkTheme } = adaptNavigationTheme({
    reactNavigationLight: NavigationDefaultTheme,
    reactNavigationDark: NavigationDarkTheme,
});

export default function App() {
    const isDarkMode = useColorScheme() === 'dark';
    const paperTheme = isDarkMode ? MD3DarkTheme : MD3LightTheme;
    const navigationTheme = isDarkMode ? DarkTheme : LightTheme;

    return (
        <SafeAreaProvider>
            <PaperProvider theme={paperTheme} settings={{ icon: props => <MaterialCommunityIcons {...props} /> }}            >
                <NavigationContainer theme={navigationTheme}>
                    <Stack.Navigator initialRouteName="Auth">
                        <Stack.Screen name="Auth" component={AuthScreen} options={{ headerShown: false }} />
                        <Stack.Screen name="Profile" component={ProfileScreen} options={{ title: 'Profile' }} />
                        <Stack.Screen name="Analysis" component={AnalysisScreen}
                            options={({ navigation }) => ({
                                title: 'Market Sentiment',
                                headerRight: () => (<IconButton icon="account-cog" onPress={() => navigation.navigate('Profile')} />),
                            })} />
                    </Stack.Navigator>
                </NavigationContainer>
            </PaperProvider>
        </SafeAreaProvider>
    );
}
