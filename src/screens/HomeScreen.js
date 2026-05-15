import { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Image,
  Alert,
} from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import { getVaccinesByCat, deleteVaccine } from '../services/vaccineService';

export default function HomeScreen({ route, navigation }) {
  const [cat, setCat] = useState(route.params?.cat);
  const [vaccines, setVaccines] = useState([]);

  useEffect(() => {
    loadVaccines();
  }, []);

  const loadVaccines = async () => {
    const data = await getVaccinesByCat(cat.id);
    setVaccines(data);
  };

  const formatDate = (date) => {
    if (!date) return '-';
    return new Date(date).toLocaleDateString('tr-TR');
  };

  const getVaccineStatus = (vaccine) => {
    if (vaccine.done) return 'Tamamlandı';

    const today = new Date();
    const vaccineDate = new Date(vaccine.date);

    today.setHours(0, 0, 0, 0);
    vaccineDate.setHours(0, 0, 0, 0);

    const diffTime = vaccineDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return 'Geçti';
    if (diffDays === 0) return 'Bugün';
    if (diffDays <= 3) return `${diffDays} gün kaldı`;
    return 'Takipte';
  };

  const handleDeleteVaccine = (vaccineId) => {
    Alert.alert(
      'Aşıyı Sil',
      'Bu aşı kaydını silmek istediğine emin misin?',
      [
        { text: 'İptal', style: 'cancel' },
        {
          text: 'Sil',
          style: 'destructive',
          onPress: async () => {
            await deleteVaccine(vaccineId);
            await loadVaccines();
          },
        },
      ]
    );
  };

  const renderRightActions = (vaccineId) => {
    return (
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => handleDeleteVaccine(vaccineId)}
      >
        <Text style={styles.deleteText}>🗑️</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.profileCard}>
        {cat?.image ? (
          <Image source={{ uri: cat.image }} style={styles.catImage} />
        ) : (
          <View style={styles.emptyImage}>
            <Text style={styles.emptyImageText}>🐱</Text>
          </View>
        )}

        <View style={styles.profileInfo}>
          <Text style={styles.catName}>{cat?.name}</Text>
          <Text style={styles.catBirth}>
            Doğum: {formatDate(cat?.birthDate)}
          </Text>

          <TouchableOpacity
            onPress={() => navigation.navigate('EditCat', { cat })}
          >
            <Text style={styles.editProfileText}>Profili Düzenle</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.headerRow}>
        <View>
          <Text style={styles.title}>Aşı Takvimi</Text>
          <Text style={styles.subtitle}>Toplam {vaccines.length} aşı kaydı</Text>
        </View>

        <TouchableOpacity
          style={styles.smallAddButton}
          onPress={() => navigation.navigate('AddVaccine', { cat })}
        >
          <Text style={styles.smallAddButtonText}>+</Text>
        </TouchableOpacity>
      </View>

      {vaccines.length === 0 ? (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyIcon}>💉</Text>
          <Text style={styles.emptyTitle}>Henüz aşı eklenmedi</Text>
          <Text style={styles.emptyText}>
            İlk aşı kaydını ekleyerek takip etmeye başlayabilirsin.
          </Text>

          <TouchableOpacity
            style={styles.addButton}
            onPress={() => navigation.navigate('AddVaccine', { cat })}
          >
            <Text style={styles.addButtonText}>Aşı Ekle</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={vaccines}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <Swipeable renderRightActions={() => renderRightActions(item.id)}>
              <TouchableOpacity
                style={styles.vaccineCard}
                onPress={() =>
                  navigation.navigate('EditVaccine', {
                    cat,
                    vaccine: item,
                  })
                }
              >
                <View style={styles.vaccineIconBox}>
                  <Text style={styles.vaccineIcon}>
                    {item.done ? '✅' : '💉'}
                  </Text>
                </View>

                <View style={{ flex: 1 }}>
                  <Text style={styles.vaccineName}>
                    {item.done ? '✅ ' : ''}
                    {item.name}
                  </Text>

                  <Text style={styles.vaccineDate}>
                    {formatDate(item.date)}
                  </Text>

                  {item.note ? (
                    <Text style={styles.vaccineNote}>{item.note}</Text>
                  ) : null}

                  <Text style={styles.editHint}>Düzenlemek için dokun</Text>
                </View>

                <Text
                  style={[
                    styles.status,
                    item.done && styles.statusDone,
                  ]}
                >
                  {getVaccineStatus(item)}
                </Text>
              </TouchableOpacity>
            </Swipeable>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FDF2E9',
    padding: 22,
  },
  profileCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 26,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 18,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 5,
  },
  catImage: {
    width: 78,
    height: 78,
    borderRadius: 39,
    marginRight: 16,
  },
  emptyImage: {
    width: 78,
    height: 78,
    borderRadius: 39,
    backgroundColor: '#FDF2E9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  emptyImageText: {
    fontSize: 35,
  },
  profileInfo: {
    flex: 1,
  },
  catName: {
    fontSize: 27,
    fontWeight: '800',
    color: '#3D2B1F',
  },
  catBirth: {
    fontSize: 14,
    color: '#7A6A5E',
    marginTop: 4,
  },
  editProfileText: {
    color: '#E67E22',
    marginTop: 7,
    fontWeight: '700',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 18,
  },
  title: {
    fontSize: 25,
    fontWeight: '800',
    color: '#3D2B1F',
  },
  subtitle: {
    fontSize: 14,
    color: '#7A6A5E',
    marginTop: 4,
  },
  smallAddButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#E67E22',
    justifyContent: 'center',
    alignItems: 'center',
  },
  smallAddButtonText: {
    color: '#FFFFFF',
    fontSize: 30,
    fontWeight: '700',
    marginTop: -2,
  },
  emptyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 26,
    padding: 28,
    alignItems: 'center',
    marginTop: 20,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 10,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#3D2B1F',
    marginBottom: 8,
  },
  emptyText: {
    color: '#7A6A5E',
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 18,
  },
  addButton: {
    backgroundColor: '#E67E22',
    paddingVertical: 14,
    paddingHorizontal: 35,
    borderRadius: 16,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  },
  vaccineCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    marginBottom: 14,
    flexDirection: 'row',
    alignItems: 'center',
  },
  vaccineIconBox: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: '#FDF2E9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  vaccineIcon: {
    fontSize: 24,
  },
  vaccineName: {
    fontSize: 17,
    fontWeight: '800',
    color: '#3D2B1F',
  },
  vaccineDate: {
    fontSize: 14,
    color: '#7A6A5E',
    marginTop: 4,
  },
  vaccineNote: {
    fontSize: 12,
    color: '#9B8576',
    marginTop: 4,
  },
  editHint: {
    fontSize: 11,
    color: '#B8A99D',
    marginTop: 4,
  },
  status: {
    fontSize: 12,
    color: '#E67E22',
    fontWeight: '800',
    maxWidth: 80,
    textAlign: 'right',
  },
  statusDone: {
    color: '#2ECC71',
  },
  deleteButton: {
    backgroundColor: '#E74C3C',
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
    borderRadius: 20,
    marginBottom: 14,
  },
  deleteText: {
    fontSize: 24,
    color: '#fff',
  },
});