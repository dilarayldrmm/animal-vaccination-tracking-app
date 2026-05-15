import AsyncStorage from '@react-native-async-storage/async-storage';
import bcrypt from 'bcryptjs';

const CATS_KEY = 'cats';

export const getCats = async () => {
  const data = await AsyncStorage.getItem(CATS_KEY);
  return data ? JSON.parse(data) : [];
};

export const saveCat = async (cat) => {
  const cats = await getCats();

  const hashedPassword = await bcrypt.hash(cat.password.trim(), 10);

  const newCat = {
    ...cat,
    name: cat.name.trim(),
    password: hashedPassword,
  };

  await AsyncStorage.setItem(CATS_KEY, JSON.stringify([...cats, newCat]));
};

export const findCatByLogin = async (name, password) => {
  const cats = await getCats();

  const cat = cats.find(
    (item) =>
      item.name.trim().toLowerCase() === name.trim().toLowerCase()
  );

  if (!cat) return null;

  const enteredPassword = password.trim();
  const savedPassword = cat.password;

  // Yeni kayıtlar bcrypt hash olur
  const isHashedPassword =
    savedPassword.startsWith('$2a$') ||
    savedPassword.startsWith('$2b$') ||
    savedPassword.startsWith('$2y$');

  if (isHashedPassword) {
    const isPasswordCorrect = await bcrypt.compare(
      enteredPassword,
      savedPassword
    );

    return isPasswordCorrect ? cat : null;
  }

  // Eski kayıtlar düz şifre olabilir
  if (savedPassword.trim() === enteredPassword) {
    return cat;
  }

  return null;
};

export const updateCat = async (updatedCat) => {
  const cats = await getCats();

  const updatedCats = cats.map((cat) =>
    cat.id === updatedCat.id ? updatedCat : cat
  );

  await AsyncStorage.setItem(CATS_KEY, JSON.stringify(updatedCats));
};

export const addVaccineToCat = async (catId, vaccine) => {
  const cats = await getCats();

  const updatedCats = cats.map((cat) => {
    if (cat.id === catId) {
      return {
        ...cat,
        vaccines: [...(cat.vaccines || []), vaccine],
      };
    }

    return cat;
  });

  await AsyncStorage.setItem(CATS_KEY, JSON.stringify(updatedCats));

  return updatedCats.find((cat) => cat.id === catId);
};

export const deleteVaccineFromCat = async (catId, vaccineId) => {
  const cats = await getCats();

  const updatedCats = cats.map((cat) => {
    if (cat.id === catId) {
      return {
        ...cat,
        vaccines: (cat.vaccines || []).filter(
          (vaccine) => vaccine.id !== vaccineId
        ),
      };
    }

    return cat;
  });

  await AsyncStorage.setItem(CATS_KEY, JSON.stringify(updatedCats));

  return updatedCats.find((cat) => cat.id === catId);
};

export const clearCats = async () => {
  await AsyncStorage.removeItem(CATS_KEY);
};

export const updateVaccineForCat = async (catId, updatedVaccine) => {
  const cats = await getCats();

  const updatedCats = cats.map((cat) => {
    if (cat.id === catId) {
      return {
        ...cat,
        vaccines: (cat.vaccines || []).map((vaccine) =>
          vaccine.id === updatedVaccine.id ? updatedVaccine : vaccine
        ),
      };
    }

    return cat;
  });

  await AsyncStorage.setItem(CATS_KEY, JSON.stringify(updatedCats));

  return updatedCats.find((cat) => cat.id === catId);
};