import { useState, useEffect, useLayoutEffect } from 'react';
import { View, ScrollView, StyleSheet, Keyboard } from 'react-native';
import { ActivityIndicator, IconButton, Text, useTheme } from 'react-native-paper';
import Markdown from 'react-native-markdown-display';
import * as Keychain from 'react-native-keychain';

import analyze from '../services/aiService';

export default function AnalysisScreen({ navigation, route }) {
    const [loading, setLoading] = useState(false);
    const [report, setReport] = useState('**Loading**');
    const [profile, setProfile] = useState({});

    const theme = useTheme();

    const runAnalysis = async () => {
        Keyboard.dismiss();
        setLoading(true);
        try {
            const credentials = await Keychain.getGenericPassword();
            const result = await analyze(credentials.password, profile.kind, profile.strategy);
            setReport(result);
            await Keychain.setGenericPassword('analysis', result, { service: 'analysis' });
        } catch (error) {
            setReport(`**Error:** ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <>
                    <IconButton icon="refresh" onPress={runAnalysis} />
                    <IconButton icon="account-cog" onPress={() => navigation.navigate('Profile')} />
                </>
            ),
        });
    }, [navigation, runAnalysis, profile]);

    const fetchCachedReport = async () => {
        const cachedReport = await Keychain.getGenericPassword({ service: 'analysis' });
        if (cachedReport && cachedReport.password) {
            setReport(cachedReport.password);
        } else {
            setReport('**No report found.**');
        }
    };

    useEffect(() => {
        async function checkKey() {
            const credentials = await Keychain.getGenericPassword();
            if (!credentials) navigation.replace('Auth');
        }
        checkKey();

        const loadProfile = async () => {
            const info = await Keychain.getGenericPassword({ service: 'profile' });
            if (info && info.password) setProfile(JSON.parse(info.password));
        };
        loadProfile();

        fetchCachedReport();
    }, []);

    const markdownStyles = {
        body: { color: theme.colors.onBackground },
        heading1: { color: theme.colors.primary },
    };

    return (
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
            {loading ? (
                <View style={styles.center}>
                    <ActivityIndicator size="large" />
                    <Text style={{ marginHorizontal: 10 }}>Analyzing...</Text>
                </View>
            ) : (
                <ScrollView contentContainerStyle={{ marginHorizontal: 10 }}>
                    <Markdown style={markdownStyles}>
                        {report}
                    </Markdown>
                </ScrollView>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});
