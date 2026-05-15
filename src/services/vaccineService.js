import { supabase } from './supabase';

export const getVaccinesByCat = async (catId) => {
  const { data, error } = await supabase
    .from('vaccines')
    .select('*')
    .eq('cat_id', catId)
    .order('date', { ascending: true });

  if (error) {
    console.log('GET VACCINES ERROR:', error);
    return [];
  }

  return data;
};

export const createVaccine = async (catId, vaccine) => {
  const { data, error } = await supabase
    .from('vaccines')
    .insert([
      {
        name: vaccine.name,
        date: vaccine.date,
        note: vaccine.note || '',
        done: false,
        cat_id: catId,
      },
    ])
    .select()
    .single();

  if (error) {
    console.log('CREATE VACCINE ERROR:', error);
    throw error;
  }

  return data;
};

export const updateVaccine = async (vaccine) => {
  const { data, error } = await supabase
    .from('vaccines')
    .update({
      name: vaccine.name,
      date: vaccine.date,
      note: vaccine.note,
      done: vaccine.done,
    })
    .eq('id', vaccine.id)
    .select()
    .single();

  if (error) {
    console.log('UPDATE VACCINE ERROR:', error);
    throw error;
  }

  return data;
};

export const deleteVaccine = async (vaccineId) => {
  const { error } = await supabase
    .from('vaccines')
    .delete()
    .eq('id', vaccineId);

  if (error) {
    console.log('DELETE VACCINE ERROR:', error);
    throw error;
  }
};