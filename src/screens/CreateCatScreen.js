import { createCat } from '../services/catService';
import { saveCat } from '../services/storageService';
import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Image,
  StyleSheet,
  Alert,
  TouchableOpacity,
  ScrollView,
  Platform,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as LocalAuthentication from 'expo-local-authentication';

export default function CreateCatScreen({ navigation }) {
  const [name, setName] = useState('');
  const [birthDate, setBirthDate] = useState(null);
  const [password, setPassword] = useState('');
  const [image, setImage] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [biometricEnabled, setBiometricEnabled] = useState(false);

  const formatDate = (date) => {
    if (!date) return 'Doğum tarihi seç';
    return date.toLocaleDateString('tr-TR');
  };

  const isPasswordStrong = (value) => {
    const hasMinLength = value.length >= 6;
    const hasLetter = /[A-Za-zÇĞİÖŞÜçğıöşü]/.test(value);
    const hasNumber = /\d/.test(value);

    return hasMinLength && hasLetter && hasNumber;
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handleDateChange = (event, selectedDate) => {
    if (Platform.OS === 'android') {
      setShowDatePicker(false);
    }

    if (selectedDate) {
      setBirthDate(selectedDate);
    }
  };

  const enableBiometric = async () => {
    const hasHardware = await LocalAuthentication.hasHardwareAsync();
    const isEnrolled = await LocalAuthentication.isEnrolledAsync();

    if (!hasHardware) {
      Alert.alert('Desteklenmiyor', 'Bu cihazda Face ID veya parmak izi desteği yok.');
      return;
    }

    if (!isEnrolled) {
      Alert.alert(
        'Biyometrik Tanımlı Değil',
        'Telefon ayarlarından Face ID veya parmak izi tanımlaman gerekiyor.'
      );
      return;
    }

    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: 'Biyometrik girişi etkinleştir',
      fallbackLabel: 'Şifre kullan',
      cancelLabel: 'İptal',
    });

    if (result.success) {
      setBiometricEnabled(true);
      Alert.alert('Başarılı', 'Biyometrik giriş aktif edildi.');
    }
  };
const handleSave = async () => {
  if (!name || !birthDate || !password) {
    Alert.alert('Eksik Bilgi', 'Lütfen tüm alanları doldurun.');
    return;
  }

  if (!isPasswordStrong(password)) {
    Alert.alert(
      'Zayıf Parola',
      'Parola en az 6 karakter olmalı, en az 1 harf ve 1 rakam içermelidir.'
    );
    return;
  }

  try {
    const newCat = await createCat({
      name: name.trim(),
      birthDate: birthDate.toISOString(),
      image,
      biometricEnabled,
    });

    Alert.alert('Başarılı', 'Kedi profili cloud sisteme kaydedildi.');
    navigation.navigate('Login');
  } catch (error) {
    console.log('KAYIT HATASI:', error);
    Alert.alert('Hata', 'Kedi profili kaydedilemedi.');
  }
};


  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Kedi Profili Oluştur</Text>
      <Text style={styles.subtitle}>Her kediniz için ayrı profil oluşturabilirsiniz.</Text>

      <TouchableOpacity style={styles.imageBox} onPress={pickImage}>
        {image ? (
          <Image source={{ uri: image }} style={styles.image} />
        ) : (
          <>
            <Text style={styles.imageIcon}>📷</Text>
            <Text style={styles.imageText}>Profil fotoğrafı seç</Text>
          </>
        )}
      </TouchableOpacity>

      <View style={styles.formCard}>
        <Text style={styles.label}>Kedi Adı</Text>
        <TextInput
          placeholder="Örn: Leo"
          value={name}
          onChangeText={setName}
          style={styles.input}
        />

        <Text style={styles.label}>Doğum Tarihi</Text>
        <TouchableOpacity
          style={styles.dateInput}
          onPress={() => setShowDatePicker(true)}
        >
          <Text style={birthDate ? styles.dateText : styles.placeholderText}>
            {formatDate(birthDate)}
          </Text>
        </TouchableOpacity>

        {showDatePicker && (
          <DateTimePicker
            value={birthDate || new Date()}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={handleDateChange}
            maximumDate={new Date()}
          />
        )}

        <Text style={styles.label}>Profil Şifresi</Text>
        <TextInput
          placeholder="En az 6 karakter, 1 harf, 1 rakam"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          style={[
            styles.input,
            password.length > 0 &&
              (isPasswordStrong(password) ? styles.validInput : styles.invalidInput),
          ]}
        />

        {password.length > 0 && (
          <Text
            style={
              isPasswordStrong(password)
                ? styles.passwordGood
                : styles.passwordBad
            }
          >
            {isPasswordStrong(password)
              ? 'Güçlü parola ✅'
              : 'En az 6 karakter, 1 harf ve 1 rakam olmalı'}
          </Text>
        )}

        <TouchableOpacity
          style={[
            styles.biometricButton,
            biometricEnabled && styles.biometricActive,
          ]}
          onPress={enableBiometric}
        >
          <Text
            style={[
              styles.biometricText,
              biometricEnabled && styles.biometricActiveText,
            ]}
          >
            {biometricEnabled
              ? 'Face ID / Parmak İzi Aktif ✅'
              : 'Face ID / Parmak İzi ile Girişi Aç'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Profili Kaydet</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#FDF2E9',
    padding: 22,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#3D2B1F',
    textAlign: 'center',
    marginTop: 20,
  },
  subtitle: {
    fontSize: 14,
    color: '#7A6A5E',
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 24,
  },
  imageBox: {
    width: 145,
    height: 145,
    borderRadius: 80,
    backgroundColor: '#FFFFFF',
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 28,
    borderWidth: 2,
    borderColor: '#E67E22',
    borderStyle: 'dashed',
  },
  image: {
    width: 145,
    height: 145,
    borderRadius: 80,
  },
  imageIcon: {
    fontSize: 34,
    marginBottom: 8,
  },
  imageText: {
    fontSize: 13,
    color: '#E67E22',
    fontWeight: '700',
    textAlign: 'center',
  },
  formCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 5,
  },
  label: {
    fontSize: 14,
    fontWeight: '700',
    color: '#3D2B1F',
    marginBottom: 7,
    marginTop: 10,
  },
  input: {
    backgroundColor: '#FAFAFA',
    borderWidth: 1,
    borderColor: '#E5D6C8',
    borderRadius: 14,
    padding: 14,
    fontSize: 15,
    marginBottom: 8,
  },
  dateInput: {
    backgroundColor: '#FAFAFA',
    borderWidth: 1,
    borderColor: '#E5D6C8',
    borderRadius: 14,
    padding: 14,
    marginBottom: 8,
  },
  dateText: {
    fontSize: 15,
    color: '#3D2B1F',
  },
  placeholderText: {
    fontSize: 15,
    color: '#999',
  },
  validInput: {
    borderColor: '#2ECC71',
  },
  invalidInput: {
    borderColor: '#E74C3C',
  },
  passwordGood: {
    color: '#2ECC71',
    fontWeight: '700',
    marginBottom: 8,
  },
  passwordBad: {
    color: '#E74C3C',
    fontWeight: '600',
    marginBottom: 8,
  },
  biometricButton: {
    borderWidth: 1.5,
    borderColor: '#E67E22',
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: 'center',
    marginTop: 12,
  },
  biometricActive: {
    backgroundColor: '#E67E22',
  },
  biometricText: {
    color: '#E67E22',
    fontSize: 15,
    fontWeight: '700',
  },
  biometricActiveText: {
    color: '#FFFFFF',
  },
  saveButton: {
    backgroundColor: '#E67E22',
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    marginTop: 18,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  },
});