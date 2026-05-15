import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Platform,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { updateVaccineForCat } from '../services/storageService';

export default function EditVaccineScreen({ route, navigation }) {
  const { cat, vaccine } = route.params;

  const [vaccineName, setVaccineName] = useState(vaccine.name);
  const [vaccineDate, setVaccineDate] = useState(new Date(vaccine.date));
  const [done, setDone] = useState(vaccine.done || false);
  const [note, setNote] = useState(vaccine.note || '');
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleDateChange = (event, selectedDate) => {
    if (Platform.OS === 'android') {
      setShowDatePicker(false);
    }

    if (selectedDate) {
      setVaccineDate(selectedDate);
    }
  };

  const handleSave = async () => {
    if (!vaccineName || !vaccineDate) {
      Alert.alert('Eksik Bilgi', 'Aşı adı ve tarih boş olamaz.');
      return;
    }

    const updatedVaccine = {
      ...vaccine,
      name: vaccineName.trim(),
      date: vaccineDate.toISOString(),
      done,
      note: note.trim(),
    };

    const updatedCat = await updateVaccineForCat(cat.id, updatedVaccine);

    Alert.alert('Başarılı', 'Aşı kaydı güncellendi.');
    navigation.navigate('Home', { cat: updatedCat });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Aşı Düzenle</Text>
      <Text style={styles.subtitle}>{cat.name} için kayıt düzenleniyor</Text>

      <View style={styles.card}>
        <Text style={styles.label}>Aşı Adı</Text>
        <TextInput
          placeholder="Örn: Kuduz Aşısı"
          value={vaccineName}
          onChangeText={setVaccineName}
          style={styles.input}
        />

        <Text style={styles.label}>Aşı Tarihi</Text>
        <TouchableOpacity
          style={styles.dateInput}
          onPress={() => setShowDatePicker(true)}
        >
          <Text style={styles.dateText}>
            {vaccineDate.toLocaleDateString('tr-TR')}
          </Text>
        </TouchableOpacity>

        {showDatePicker && (
          <DateTimePicker
            value={vaccineDate}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={handleDateChange}
          />
        )}

        <Text style={styles.label}>Not</Text>
        <TextInput
          placeholder="Veteriner adı, doz bilgisi vb."
          value={note}
          onChangeText={setNote}
          style={[styles.input, styles.noteInput]}
          multiline
        />

        <TouchableOpacity
          style={[styles.doneButton, done && styles.doneButtonActive]}
          onPress={() => setDone(!done)}
        >
          <Text style={[styles.doneButtonText, done && styles.doneButtonTextActive]}>
            {done ? 'Tamamlandı ✅' : 'Tamamlandı olarak işaretle'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Güncelle</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FDF2E9',
    padding: 22,
  },
  title: {
    fontSize: 30,
    fontWeight: '800',
    color: '#3D2B1F',
    textAlign: 'center',
    marginTop: 25,
  },
  subtitle: {
    fontSize: 15,
    color: '#7A6A5E',
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 25,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '700',
    color: '#3D2B1F',
    marginBottom: 8,
    marginTop: 10,
  },
  input: {
    backgroundColor: '#FAFAFA',
    borderWidth: 1,
    borderColor: '#E5D6C8',
    borderRadius: 14,
    padding: 14,
    fontSize: 15,
    marginBottom: 10,
  },
  noteInput: {
    height: 90,
    textAlignVertical: 'top',
  },
  dateInput: {
    backgroundColor: '#FAFAFA',
    borderWidth: 1,
    borderColor: '#E5D6C8',
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
  },
  dateText: {
    color: '#3D2B1F',
    fontSize: 15,
  },
  doneButton: {
    borderWidth: 1.5,
    borderColor: '#2ECC71',
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: 'center',
    marginTop: 12,
  },
  doneButtonActive: {
    backgroundColor: '#2ECC71',
  },
  doneButtonText: {
    color: '#2ECC71',
    fontSize: 15,
    fontWeight: '800',
  },
  doneButtonTextActive: {
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