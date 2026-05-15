import * as Notifications from 'expo-notifications';

export const requestNotificationPermission = async () => {
  const { status } = await Notifications.requestPermissionsAsync();
  return status === 'granted';
};

const createNotificationDate = (vaccineDate, daysBefore) => {
  const date = new Date(vaccineDate);
  date.setDate(date.getDate() - daysBefore);
  date.setHours(9, 0, 0, 0);
  return date;
};

export const scheduleVaccineNotifications = async (
  catName,
  vaccineName,
  vaccineDate
) => {
  const hasPermission = await requestNotificationPermission();

  if (!hasPermission) {
    return;
  }

  const reminders = [
    { daysBefore: 7, message: '7 gün kaldı' },
    { daysBefore: 3, message: '3 gün kaldı' },
    { daysBefore: 1, message: '1 gün kaldı' },
    { daysBefore: 0, message: 'bugün' },
  ];

  for (const reminder of reminders) {
    const notificationDate = createNotificationDate(
      vaccineDate,
      reminder.daysBefore
    );

    if (notificationDate > new Date()) {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: 'Aşı Hatırlatması 🐾',
          body:
            reminder.daysBefore === 0
              ? `Kediniz ${catName}'nun ${vaccineName} aşısı bugün.`
              : `Kediniz ${catName}'nun ${vaccineName} aşısına ${reminder.message}.`,
          sound: true,
        },
        trigger: notificationDate,
      });
    }
  }
};