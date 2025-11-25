import { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput, Button, Text, HelperText, useTheme } from 'react-native-paper';
import * as Keychain from 'react-native-keychain';

export default function AuthScreen({ navigation, route }) {
  const [apiKey, setApiKey] = useState('');
  const theme = useTheme();

  const isUpdate = route.params?.isUpdate || false;

  useEffect(() => {
    async function checkKey() {
      if (isUpdate) return;

      try {
        const credentials = await Keychain.getGenericPassword();
        if (credentials) navigation.replace('Analysis');
      } catch (e) {}
    }
    checkKey();
  }, [isUpdate]);

  const saveKey = async () => {
    if (apiKey.length < 5) return alert("Invalid Key");

    await Keychain.setGenericPassword('app_user', apiKey);

    if (isUpdate) {
      navigation.popToTop();
    } else {
      navigation.replace('Analysis');
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Text variant="headlineMedium" style={{ color: theme.colors.primary }}>
        {isUpdate ? "Update API Key" : "API Setup"}
      </Text>

      <Text variant="bodyLarge">
        {isUpdate
          ? "Enter a new key to overwrite the existing one."
          : "Enter your API key to access sentiment analysis."}
      </Text>

      <View>
        <TextInput
          label="API Key"
          value={apiKey}
          onChangeText={setApiKey}
          mode="outlined"
          secureTextEntry
          placeholder={isUpdate ? "Enter new key..." : ""}
          left={<TextInput.Icon icon="key" />}
        />
        <HelperText type="info">Key is stored securely on your device.</HelperText>
      </View>

      <Button mode="contained" onPress={saveKey} contentStyle={{ paddingVertical: 5 }}>
        {isUpdate ? "Update Key" : "Save & Continue"}
      </Button>

      {isUpdate && (
        <Button mode="text" onPress={() => navigation.goBack()}>
          Cancel
        </Button>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20, gap: 20 },
});
