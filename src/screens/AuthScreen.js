import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { supabase } from '../services/supabase';

export default function AuthScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // 🔥 KAYIT
  const signUp = async () => {
    console.log("SIGN UP BASILDI");

    const { data, error } = await supabase.auth.signUp({
      email: email.trim(),
      password: password.trim(),
    });

    if (error) {
      console.log("SIGN UP ERROR:", error);
      Alert.alert('Kayıt Hatası', error.message);
      return;
    }

    Alert.alert('Başarılı', 'Hesap oluşturuldu. Giriş yapabilirsin.');
  };

  // 🔥 GİRİŞ
  const signIn = async () => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password: password.trim(),
    });

    if (error) {
      Alert.alert('Giriş Hatası', error.message);
      return;
    }

    navigation.replace('Login');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Hesap Girişi</Text>

      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
      />

      <TextInput
        placeholder="Şifre"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />

      <TouchableOpacity style={styles.button} onPress={signIn}>
        <Text style={styles.buttonText}>Giriş Yap</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button2} onPress={signUp}>
        <Text style={styles.buttonText2}>Hesap Oluştur</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#FDF2E9',
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    padding: 12,
    marginBottom: 10,
    borderRadius: 10,
  },
  button: {
    backgroundColor: '#E67E22',
    padding: 14,
    borderRadius: 10,
    marginTop: 10,
  },
  button2: {
    borderWidth: 1,
    borderColor: '#E67E22',
    padding: 14,
    borderRadius: 10,
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  buttonText2: {
    color: '#E67E22',
    textAlign: 'center',
    fontWeight: 'bold',
  },
});