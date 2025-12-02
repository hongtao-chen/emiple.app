import { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, TextInput, Button, Chip, Divider, useTheme } from 'react-native-paper';
import * as Keychain from 'react-native-keychain';

export default function ProfileScreen({ navigation }) {
  const [kind, setKind] = useState('Growth');
  const [strategy, setStrategy] = useState('');

  const theme = useTheme();

  useEffect(() => {
    const loadProfile = async () => {
      const info = await Keychain.getGenericPassword({ service: 'profile' });
      if (info && info.password) {
        const p = JSON.parse(info.password);
        if (p.kind) setKind(p.kind);
        if (p.strategy) setStrategy(p.strategy);
      }
    };

    loadProfile();
  }, []);

  const handleSave = async () => {
    await Keychain.setGenericPassword('profile', JSON.stringify({ kind, strategy }), { service: 'profile' });
    navigation.navigate('Analysis');
  };

  const handleClear = async () => {
    await Keychain.resetGenericPassword({ service: 'profile' });
    navigation.navigate('Analysis');
  };

  const handleChangeKey = () => {
    navigation.navigate('Auth', { isUpdate: true });
  };

  return (
    <ScrollView contentContainerStyle={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Text variant="bodyMedium">Select your investment style</Text>

      <View style={styles.chipRow}>
        {['Conservative', 'Growth', 'Day Trader'].map((item) => (
          <View key={item} style={styles.chipContainer}>
            <Chip
              compact
              selected={kind === item}
              showSelectedOverlay
              onPress={() => setKind(item)}
              style={styles.chip}
              textStyle={styles.chipText}>
              {item}
            </Chip>
          </View>
        ))}
      </View>

      <TextInput
        label="Personal Strategy & Focus"
        placeholder="Describe your investment strategy, preferred sectors, or any specific constraints (e.g. 'I focus on AI and Green Energy, but avoid crypto')."
        value={strategy}
        onChangeText={setStrategy}
        mode="outlined"
        multiline={true}
        numberOfLines={20}
        style={styles.textArea}
      />

      <Button mode="contained" icon="check" onPress={handleSave} style={{ marginTop: 10 }}>
        Save Profile
      </Button>

      <Button mode="outlined" icon="key" onPress={handleChangeKey} style={{ borderColor: theme.colors.outline, marginTop: 10 }}>
        Change API Key
      </Button>

      <Button mode="text" onPress={handleClear} textColor={theme.colors.error}>
        Clear Profile & Return
      </Button>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 10 },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', marginHorizontal: -6 },
  chipContainer: { paddingHorizontal: 3, paddingVertical: 6 },
  chip: { alignSelf: 'flex-start', paddingVertical: 1, paddingHorizontal: 3, borderRadius: 16 },
  chipText: { fontSize: 12, lineHeight: 14 },
  textArea: { minHeight: 400, textAlignVertical: 'top' }
});
