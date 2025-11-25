import { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, Keyboard } from 'react-native';
import { TextInput, ActivityIndicator, Text, useTheme } from 'react-native-paper';
import Markdown from 'react-native-markdown-display';
import * as Keychain from 'react-native-keychain';

export default function AnalysisScreen({ route }) {
  const [ticker, setTicker] = useState('');
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState('**Enter a stock symbol to start.**');
  const [userProfile, setUserProfile] = useState({});

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
        body: JSON.stringify({ symbol: ticker, user_context: userProfile })
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
    const loadProfile = async () => {
      try {
        const creds = await Keychain.getGenericPassword({ service: 'user_profile' });
        if (creds && creds.password) setUserProfile(JSON.parse(creds.password));
      } catch (e) {
        console.error('Failed to load user profile', e);
      }
    };
    loadProfile();
  }, []);

  const markdownStyles = {
    body: { color: theme.colors.onBackground },
    heading1: { color: theme.colors.primary },
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <TextInput
        label="Stock Symbol (e.g. NVDA)"
        value={ticker}
        onChangeText={text => setTicker(text.toUpperCase())}
        mode="outlined"
        right={<TextInput.Icon icon="magnify" onPress={runAnalysis} />}
        style={{ marginBottom: 10 }}
      />

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" />
          <Text style={{ marginTop: 20 }}>Analyzing...</Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
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
