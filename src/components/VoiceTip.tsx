import * as Speech from 'expo-speech';
import { useState } from 'react';
import { View, TouchableOpacity, Text, Modal, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const TIP_TEXT = {
  en: "No two digits repeat in the code. After each guess, rule out grey digits — don't reuse them in your next try.",
  ta: "குறியீட்டில் இரண்டு இலக்கங்கள் மீண்டும் வராது. ஒவ்வொரு யூகத்திற்குப் பிறகும், சாம்பல் நிற இலக்கங்களை நீக்கிவிடுங்கள் — அவற்றை மீண்டும் பயன்படுத்த வேண்டாம்.",
  hi: "कोड में कोई भी अंक दो बार नहीं आता। हर अनुमान के बाद, ग्रे रंग के अंकों को हटा दें — उन्हें दोबारा इस्तेमाल न करें।",
};

const LANG_CODES = {
  en: 'en-US',
  ta: 'ta-IN',
  hi: 'hi-IN',
};

export default function VoiceTip() {
  const [showPicker, setShowPicker] = useState(false);

  const speak = async (lang: 'en' | 'ta' | 'hi') => {
    const speaking = await Speech.isSpeakingAsync();
    if (speaking) Speech.stop();

    Speech.speak(TIP_TEXT[lang], {
      language: LANG_CODES[lang],
      pitch: 1,
      rate: 0.95,
    });
    setShowPicker(false);
  };

  return (
    <View>
      <TouchableOpacity onPress={() => setShowPicker(true)}>
        <Ionicons name="mic-outline" size={20} color="#facc15" />
      </TouchableOpacity>

      <Modal visible={showPicker} transparent animationType="fade">
        <TouchableOpacity
          style={styles.overlay}
          onPress={() => setShowPicker(false)}
        >
          <View style={styles.card}>
            <Text style={styles.title}>Select Language</Text>
            {(['en', 'ta', 'hi'] as const).map((lang) => (
              <TouchableOpacity key={lang} onPress={() => speak(lang)} style={styles.option}>
                <Text style={styles.optionText}>
                  {lang === 'en' ? 'English' : lang === 'ta' ? 'தமிழ் (Tamil)' : 'हिंदी (Hindi)'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', alignItems: 'center' },
  card: { backgroundColor: '#1e293b', borderRadius: 12, padding: 20, width: 220 },
  title: { color: 'white', marginBottom: 12, fontWeight: 'bold' },
  option: { paddingVertical: 10 },
  optionText: { color: 'white' },
});