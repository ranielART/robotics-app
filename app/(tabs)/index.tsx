import React, { useEffect, useState } from 'react';
import { Alert, SafeAreaView, StyleSheet } from 'react-native';
import { ActivityIndicator, Card, Paragraph, Title } from 'react-native-paper';

const DEVICE_IP = '192.168.68.119'; // <-- your ESP8266 IP
const API_URL = `http://${DEVICE_IP}/wind-speed`;

export default function HomeScreen() {
  const [windSpeed, setWindSpeed] = useState(null);
  const [alarm, setAlarm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [timestamp, setTimestamp] = useState('');

  const fetchWindSpeed = async () => {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();

      const currentTime = new Date().toLocaleTimeString();
      setTimestamp(currentTime);
      setWindSpeed(data.speed);
      setAlarm(data.alarm);
      setLoading(false);

      if (data.alarm) {
        Alert.alert(
          '⚠️ High Wind Speed!',
          `Current speed: ${data.speed} m/s\nTime: ${currentTime}`
        );
      }
    } catch (error) {
      console.error('Fetch error:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWindSpeed();

    // Auto-refresh every 300ms (can adjust to avoid overload)
    const interval = setInterval(fetchWindSpeed, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Title>🌬️ Wind Speed Monitor</Title>
          {loading ? (
            <ActivityIndicator animating={true} size="large" />
          ) : (
            <>
              <Paragraph>Wind Speed: {windSpeed} m/s</Paragraph>
              <Paragraph style={{ color: alarm ? 'red' : 'green' }}>
                Alarm: {alarm ? 'YES' : 'NO'}
              </Paragraph>
              <Paragraph>Last Updated: {timestamp}</Paragraph>
            </>
          )}
        </Card.Content>
      </Card>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#f6f6f6',
    padding: 16,
  },
  card: {
    padding: 16,
  },
});
