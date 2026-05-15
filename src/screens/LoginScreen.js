import { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  FlatList,
  Image,
} from 'react-native';
import { getMyCats } from '../services/catService';
import { supabase } from '../services/supabase';

export default function LoginScreen({ navigation }) {
  const [cats, setCats] = useState([]);

  useEffect(() => {
    loadCats();
  }, []);

  const loadCats = async () => {
    const savedCats = await getMyCats();
    setCats(savedCats);
  };

  const openCat = (cat) => {
    const formattedCat = {
      id: cat.id,
      name: cat.name,
      birthDate: cat.birth_date,
      image: cat.image,
      biometricEnabled: cat.biometric_enabled,
      vaccines: [],
    };

    navigation.navigate('Home', { cat: formattedCat });
  };

  const logout = async () => {
    await supabase.auth.signOut();
    navigation.replace('Auth');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🐾 Pati Aşı Takip</Text>
      <Text style={styles.subtitle}>Kedi profilini seç</Text>

      {cats.length === 0 ? (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyIcon}>🐱</Text>
          <Text style={styles.emptyTitle}>Henüz kedi profili yok</Text>
          <Text style={styles.emptyText}>
            İlk kedi profilini oluşturarak başlayabilirsin.
          </Text>

          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => navigation.navigate('CreateCat')}
          >
            <Text style={styles.primaryButtonText}>Kedi Profili Oluştur</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={cats}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.catCard}
              onPress={() => openCat(item)}
            >
              {item.image ? (
                <Image source={{ uri: item.image }} style={styles.catImage} />
              ) : (
                <View style={styles.emptyImage}>
                  <Text style={styles.emptyImageText}>🐱</Text>
                </View>
              )}

              <View style={{ flex: 1 }}>
                <Text style={styles.catName}>{item.name}</Text>
                <Text style={styles.catBirth}>
                  Doğum: {item.birth_date
                    ? new Date(item.birth_date).toLocaleDateString('tr-TR')
                    : '-'}
                </Text>
              </View>

              <Text style={styles.arrow}>›</Text>
            </TouchableOpacity>
          )}
        />
      )}

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate('CreateCat')}
      >
        <Text style={styles.addButtonText}>+ Yeni Kedi</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={logout}>
        <Text style={styles.logoutText}>Çıkış Yap</Text>
      </TouchableOpacity>
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
    marginTop: 30,
  },
  subtitle: {
    fontSize: 15,
    color: '#7A6A5E',
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 25,
  },
  catCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 16,
    marginBottom: 14,
    flexDirection: 'row',
    alignItems: 'center',
  },
  catImage: {
    width: 68,
    height: 68,
    borderRadius: 34,
    marginRight: 15,
  },
  emptyImage: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: '#FDF2E9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  emptyImageText: {
    fontSize: 30,
  },
  catName: {
    fontSize: 21,
    fontWeight: '800',
    color: '#3D2B1F',
  },
  catBirth: {
    fontSize: 13,
    color: '#7A6A5E',
    marginTop: 4,
  },
  arrow: {
    fontSize: 34,
    color: '#E67E22',
  },
  emptyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 26,
    padding: 28,
    alignItems: 'center',
    marginTop: 50,
  },
  emptyIcon: {
    fontSize: 50,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '800',
    marginTop: 10,
    color: '#3D2B1F',
  },
  emptyText: {
    fontSize: 14,
    color: '#7A6A5E',
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 20,
  },
  primaryButton: {
    backgroundColor: '#E67E22',
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 16,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontWeight: '800',
  },
  addButton: {
    backgroundColor: '#E67E22',
    paddingVertical: 16,
    borderRadius: 18,
    alignItems: 'center',
    marginTop: 12,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  },
  logoutText: {
    color: '#7A6A5E',
    textAlign: 'center',
    marginTop: 16,
    fontWeight: '700',
  },
});