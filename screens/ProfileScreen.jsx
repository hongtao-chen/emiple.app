import { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, TextInput, Button, Chip, Divider, useTheme } from 'react-native-paper';
import * as Keychain from 'react-native-keychain';

export default function ProfileScreen({ navigation }) {
  const [investmentStyle, setInvestmentStyle] = useState('Growth');
  const [strategy, setStrategy] = useState('');

  const theme = useTheme();

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const creds = await Keychain.getGenericPassword({ service: 'user_profile' });
        if (creds && creds.password) {
          const p = JSON.parse(creds.password);
          if (p.style) setInvestmentStyle(p.style);
          if (p.strategy) setStrategy(p.strategy);
        }
      } catch (e) {
        console.error('Failed to load profile', e);
      }
    };

    loadProfile();
  }, []);

  const handleSave = async () => {
    try {
      await Keychain.setGenericPassword('profile', JSON.stringify({ style: investmentStyle, strategy }), { service: 'user_profile' });
      navigation.navigate('Analysis');
    } catch (e) {
      console.error('Failed to save profile', e);
    }
  };

  const handleClear = async () => {
    try {
      await Keychain.resetGenericPassword({ service: 'user_profile' });
      navigation.navigate('Analysis');
    } catch (e) {
      console.error('Failed to clear profile', e);
    }
  };

  const handleChangeKey = () => {
    navigation.navigate('Auth', { isUpdate: true });
  };

  return (
    <ScrollView contentContainerStyle={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Text variant="bodyLarge">
        Update your investor profile here. The AI uses this to tailor the analysis.
      </Text>

      <Text variant="titleMedium">Investment Style</Text>

      <View style={styles.chipRow}>
        {['Conservative', 'Growth', 'Day Trader'].map((style) => (
          <View key={style} style={styles.chipContainer}>
            <Chip
              selected={investmentStyle === style}
              showSelectedOverlay
              onPress={() => setInvestmentStyle(style)}
              style={styles.chip}
            >
              {style}
            </Chip>
          </View>
        ))}
      </View>

      <TextInput
        label="Investment Strategy & Focus"
        placeholder="Describe your strategy, preferred sectors, or any specific constraints (e.g. 'I focus on AI and Green Energy, but avoid crypto')."
        value={strategy}
        onChangeText={setStrategy}
        mode="outlined"
        multiline={true}
        numberOfLines={10}
        style={styles.textArea}
      />

      <Divider />

      <Button mode="contained" icon="check" onPress={handleSave} contentStyle={{ flexDirection: 'row-reverse' }}>
        Save Context
      </Button>

      <Button mode="outlined" icon="key" onPress={handleChangeKey} style={{ borderColor: theme.colors.outline }}>
        Change API Key
      </Button>

      <Button mode="text" onPress={handleClear} textColor={theme.colors.error}>
        Clear Context & Return
      </Button>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 20 },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', marginHorizontal: -6 },
  chipContainer: { flexBasis: '33.333%', paddingHorizontal: 6, paddingVertical: 6 },
  chip: { width: '100%' },
  textArea: { minHeight: 200, textAlignVertical: 'top' }
});
