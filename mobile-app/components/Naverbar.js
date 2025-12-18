import * as React from 'react';
import { useNavigation } from '@react-navigation/native';
import { View, TouchableOpacity } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Navbar = () => {
  const navigation = useNavigation();

  const handleGoBack = () => {
    navigation.goBack();
  };

  const handleGoHome = () => {
    navigation.navigate('Home');
  };

  const handleLogout = async () => {
      try {

            await AsyncStorage.removeItem('token');
        
        const response = await fetch('http://localhost:4000/api/v3/deliver/logout', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          
        });
    
        if (response.ok) {
            Toast.show({
                  type: 'error',
                  text1: 'Logout successfuly',
                });
          navigation.navigate('Login');
        } else {
          console.error('Logout error:', response.status);
        }
      } catch (error) {
        console.error('Logout error:', error);
      }
    };
  

  return (
    <View style={styles.navbarContainer}>
      <TouchableOpacity onPress={handleGoBack}>
        <FontAwesome name="arrow-left" size={24} />
      </TouchableOpacity>
      <TouchableOpacity onPress={handleGoHome}>
        <FontAwesome name="home" size={24} />
      </TouchableOpacity>
      <TouchableOpacity onPress={handleLogout}>
        <FontAwesome name="sign-out" size={24} />
      </TouchableOpacity>
      <Toast ref={(ref) => Toast.setRef(ref)} />

    </View>
  );
};

export default Navbar;

const styles = {
      navbarContainer: {
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            zIndex: 9999,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingHorizontal: 16,
            height: 60,
            backgroundColor: '#f0f0f0',
          },
};
