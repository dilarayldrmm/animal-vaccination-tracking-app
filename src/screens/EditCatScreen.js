import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Image,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { updateCat } from '../services/storageService';

export default function EditCatScreen({ route, navigation }) {
  const oldCat = route.params?.cat;

  const [name, setName] = useState(oldCat.name);
  const [birthDate, setBirthDate] = useState(new Date(oldCat.birthDate));
  const [image, setImage] = useState(oldCat.image);
  const [showDate, setShowDate] = useState(false);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handleSave = async () => {
    if (!name) {
      Alert.alert('Hata', 'İsim boş olamaz');
      return;
    }

    const updatedCat = {
      ...oldCat,
      name,
      birthDate: birthDate.toISOString(),
      image,
    };

    await updateCat(updatedCat);

    Alert.alert('Başarılı', 'Profil güncellendi');
    navigation.navigate('Home', { cat: updatedCat });
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Profili Düzenle</Text>

      <TouchableOpacity onPress={pickImage}>
        {image ? (
          <Image source={{ uri: image }} style={styles.image} />
        ) : (
          <View style={styles.emptyImage}>
            <Text>📷</Text>
          </View>
        )}
      </TouchableOpacity>

      <Text style={styles.label}>Kedi Adı</Text>
      <TextInput value={name} onChangeText={setName} style={styles.input} />

      <Text style={styles.label}>Doğum Tarihi</Text>
      <TouchableOpacity
        style={styles.dateInput}
        onPress={() => setShowDate(true)}
      >
        <Text>{birthDate.toLocaleDateString('tr-TR')}</Text>
      </TouchableOpacity>

      {showDate && (
        <DateTimePicker
          value={birthDate}
          mode="date"
          onChange={(e, date) => {
            setShowDate(false);
            if (date) setBirthDate(date);
          }}
        />
      )}

      <TouchableOpacity style={styles.button} onPress={handleSave}>
        <Text style={styles.buttonText}>Kaydet</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FDF2E9', padding: 20 },
  title: { fontSize: 26, fontWeight: '800', marginBottom: 20 },
  image: { width: 120, height: 120, borderRadius: 60, alignSelf: 'center' },
  emptyImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#EEE',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  label: { marginTop: 15, fontWeight: '700' },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    borderRadius: 10,
    marginTop: 5,
  },
  dateInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    borderRadius: 10,
    marginTop: 5,
  },
  button: {
    backgroundColor: '#E67E22',
    padding: 15,
    borderRadius: 12,
    marginTop: 20,
    alignItems: 'center',
  },
  buttonText: { color: '#fff', fontWeight: '800' },
});