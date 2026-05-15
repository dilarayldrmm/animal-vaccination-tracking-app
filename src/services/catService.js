import { supabase } from './supabase';

export const getCurrentUser = async () => {
  const { data, error } = await supabase.auth.getUser();

  if (error) {
    console.log('USER ERROR:', error);
    return null;
  }

  return data.user;
};

export const createCat = async (cat) => {
  const user = await getCurrentUser();

  if (!user) {
    throw new Error('Kullanıcı oturumu bulunamadı.');
  }

  const { data, error } = await supabase
    .from('cats')
    .insert([
      {
        name: cat.name,
        birth_date: cat.birthDate,
        image: cat.image,
        user_id: user.id,
        biometric_enabled: cat.biometricEnabled || false,
      },
    ])
    .select()
    .single();

  if (error) {
    console.log('CREATE CAT ERROR:', error);
    throw error;
  }

  return data;
};

export const getMyCats = async () => {
  const user = await getCurrentUser();

  if (!user) {
    return [];
  }

  const { data, error } = await supabase
    .from('cats')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) {
    console.log('GET CATS ERROR:', error);
    return [];
  }

  return data;
};