import { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, Keyboard } from 'react-native';
import { ActivityIndicator, Text, useTheme } from 'react-native-paper';
import Markdown from 'react-native-markdown-display';
import * as Keychain from 'react-native-keychain';

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
      if (!credentials) throw new Error("No API Key found.");

      const response = await fetch('https://your-api.com/sentiment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${credentials.password}` },
        body: JSON.stringify({ profile })
      });

      const data = await response.json();
      setReport(data.content || "No content returned.");
    } catch (error) {
      setReport(`**Error:** ${error.message}`);
    } finally {
      setLoading(false);
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
