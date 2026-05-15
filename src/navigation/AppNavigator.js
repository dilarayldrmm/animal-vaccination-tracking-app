import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import EditCatScreen from '../screens/EditCatScreen';
import LoginScreen from '../screens/LoginScreen';
import CreateCatScreen from '../screens/CreateCatScreen';
import HomeScreen from '../screens/HomeScreen';
import AddVaccineScreen from '../screens/AddVaccineScreen';
import EditVaccineScreen from '../screens/EditVaccineScreen';
import AuthScreen from '../screens/AuthScreen';


const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen
          name="Auth"
          component={AuthScreen}
          options={{ title: 'Hesap Girişi' }}
        />
        <Stack.Screen 
          name="Login" 
          component={LoginScreen} 
          options={{ title: 'Kedi Girişi' }}
        />
        <Stack.Screen 
          name="CreateCat" 
          component={CreateCatScreen} 
          options={{ title: 'Kedi Profili Oluştur' }}
        />
        <Stack.Screen 
          name="EditCat" 
          component={EditCatScreen} 
          options={{ title: 'Kedi Bilgilerini Düzenle' }}
        />
        <Stack.Screen
          name="EditVaccine"
          component={EditVaccineScreen}
          options={{ title: 'Aşı Düzenle' }}
        />
        <Stack.Screen 
          name="Home" 
          component={HomeScreen} 
          options={{ title: 'Aşı Takvimi' }}
        />
        <Stack.Screen 
          name="AddVaccine" 
          component={AddVaccineScreen} 
          options={{ title: 'Aşı Ekle' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}