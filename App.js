import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Modal,
} from 'react-native';

export default function App() {
  const [connected, setConnected] = useState(false);
  const [data, setData] = useState([]);
  const [flashing, setFlashing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  const simulateDatabaseConnection = async () => {
    try {
      const response = await fetch('https://driver-data.onrender.com/logs', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const jsonData = await response.json();

        if (Array.isArray(jsonData) && jsonData.length > 0) {
          setData(jsonData);

          const newEntry = jsonData[jsonData.length - 1];
          const isDangerous = newEntry.warning.toLowerCase().includes('danger');
          const isWarning = newEntry.warning.toLowerCase().includes('warning');

          if (isDangerous || isWarning) {
            setFlashing(true);

            setTimeout(() => {
              setFlashing(false);
            }, 3000);
          } else {
            setFlashing(false); // Set flashing to false if there is no danger or warning
          }

          setConnected(true);
        } else {
          console.error('API response is not an array or is empty:', jsonData);
        }
      } else {
        const errorText = await response.text();
        console.error('Failed to fetch data:', response.status, errorText);
      }
    } catch (error) {
      console.error('Error during fetch:', error);
    }
  };

  const showLatestEntry = () => {
    if (data.length > 0) {
      const latestEntry = data[data.length - 1];

      return (
        <View style={styles.dataContainer}>
          <View key={latestEntry.id} style={styles.dataItem}>
            <Text>{`Id: ${latestEntry.id}`}</Text>
            <Text>{`Warning: ${latestEntry.warning}`}</Text>
            <Text>{`Description: ${latestEntry.description}`}</Text>
          </View>
        </View>
      );
    } else {
      return null;
    }
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      simulateDatabaseConnection();
    }, 100);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  const handleHelpButton = () => {
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
  };

  return (
    <View style={[styles.container, flashing && styles.flashingBackground]}>
      <ScrollView contentContainerStyle={styles.scrollViewContent} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <Text style={styles.logoText}>Drive Aware</Text>
          <TouchableOpacity style={styles.helpButton} onPress={handleHelpButton}>
            <Text style={styles.helpButtonText}>Ajutor</Text>
          </TouchableOpacity>
        </View>

        {showLatestEntry()}

        {/* Flashing Background */}
        {flashing && <View style={styles.flashingBackgroundOverlay} />}
      </ScrollView>

      {/* Connect Button */}
      <TouchableOpacity style={styles.connectButton} onPress={simulateDatabaseConnection}>
        <Text style={styles.connectButtonText}>Start</Text>
      </TouchableOpacity>

      {/* Help Modal */}
      <Modal animationType="slide" transparent={true} visible={modalVisible}>
        <View style={styles.modal}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTextHeader}>Bine ai venit la Drive Aware!</Text>
            <Text style={styles.modalText}>Aici este manualul de utilizare al aplicatiei:</Text>
            <Text style={styles.modalText}>1. Apasand butonul start aplicatia o sa porneasca.</Text>
            <Text style={styles.modalText}>2. Semnificatia cromaticii tipului de alerta: Galben - Atentionare</Text>
            <Text style={styles.modalText}>3. Alerte primite: SMS - atentionare, Apel de urgenta!</Text>
          </View>
          <TouchableOpacity style={styles.closeButton} onPress={handleCloseModal}>
            <Text style={styles.closeButtonText}>Inchide</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#D6FBE4',
  },
  scrollViewContent: {
    flexGrow: 1,
  },
  logoText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginLeft: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 40,
    paddingHorizontal: 20,
  },
  helpButton: {
    backgroundColor: '#1DB954',
    padding: 10,
    borderRadius: 25,
    marginLeft: 10,
  },
  helpButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  dataContainer: {
    alignItems: 'center',
    padding: 20,
  },
  dataItem: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 10,
    marginBottom: 10,
    shadowColor: 'rgba(0, 0, 0, 0.1)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
    elevation: 5,
  },
  flashingBackground: {
    backgroundColor: 'red',
  },
  flashingBackgroundOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    zIndex: 1,
  },
  connectButton: {
    backgroundColor: '#1DB954',
    padding: 15,
    borderRadius: 25,
    margin: 20,
    alignItems: 'center',
  },
  connectButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  modal: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTextHeader: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    color: '#1DB954',
  },
  modalText: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'left',
    color: '#333',
  },
  closeButton: {
    backgroundColor: '#1DB954',
    padding: 15,
    borderRadius: 25,
    marginTop: 20,
  },
  closeButtonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
