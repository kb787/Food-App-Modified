import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  TextInput,
  Alert,
  Animated,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faFilter} from '@fortawesome/free-solid-svg-icons';

const NavbarProductPage = ({onDataUpdate}) => {
  const [productRate, setProductRate] = useState('');
  const [productType, setProductType] = useState('');
  const [productName, setProductName] = useState('');
  const [categoryData, setCategoryData] = useState([]);
  const [isExpanded, setIsExpanded] = useState(false);
  const [buttonClicked, setButtonClicked] = useState(false);

  // Load saved filters from AsyncStorage on component mount
  useEffect(() => {
    loadSavedFilters();
  }, []);

  const loadSavedFilters = async () => {
    try {
      const savedFilters = await AsyncStorage.getItem('productFilters');
      if (savedFilters) {
        const {name, type, rate} = JSON.parse(savedFilters);
        setProductName(name || '');
        setProductType(type || '');
        setProductRate(rate || '');
      }
    } catch (error) {
      console.error('Error loading saved filters:', error);
    }
  };

  const saveFiltersToStorage = async () => {
    try {
      const filters = {
        name: productName,
        type: productType,
        rate: productRate,
      };
      await AsyncStorage.setItem('productFilters', JSON.stringify(filters));
    } catch (error) {
      console.error('Error saving filters:', error);
    }
  };

  const handleFilterButtonClick = async () => {
    setButtonClicked(true);
    if (!productName && !productType && !productRate) {
      Alert.alert(
        'Entering any of the fields is mandatory for filter to be working',
      );
      return;
    }

    // Save filters to local storage
    await saveFiltersToStorage();

    try {
      let apiUrl = '';
      if (buttonClicked === true) {
        apiUrl = `http://192.168.68.116:3500/v1/api/product/search-product?productName=${productName}&productType=${productType}&productRate=${productRate}`;
      } else {
        apiUrl = 'http://192.168.68.116:3500/v1/api/product/show-product';
      }
      const response = await fetch(apiUrl);
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }
      const jsonResponse = await response.json();
      if (Array.isArray(jsonResponse)) {
        setCategoryData(jsonResponse);
      } else {
        const convertedArray = await JSON.parse(jsonResponse);
        setCategoryData(convertedArray);
      }
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  useEffect(() => {
    onDataUpdate({categoryData, buttonClicked});
  }, [categoryData, buttonClicked]);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <View style={styles.navbarWrapping}>
      <View style={styles.headerContainer}>
        <TextInput
          type="text"
          value={productName}
          onChangeText={text => setProductName(text)}
          placeholder="Enter name"
          style={styles.mainSearchInput}
        />
        <TouchableOpacity onPress={toggleExpand} style={styles.filterIcon}>
          {/* < name="filter" size={20} color="white" /> */}
          <FontAwesomeIcon icon={faFilter} style={{color: 'white'}} />
        </TouchableOpacity>
      </View>

      {isExpanded && (
        <View style={styles.expandedFilters}>
          <View style={styles.itemCollection}>
            <View style={styles.inputContainer}>
              <Text style={styles.outerTextStyling}>Rate</Text>
              <TextInput
                keyboardType="numeric"
                value={productRate}
                onChangeText={text => setProductRate(text)}
                placeholder="100-300"
                style={styles.textInputStyling}
              />
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.outerTextStyling}>Category</Text>
              <TextInput
                type="text"
                value={productType}
                onChangeText={text => setProductType(text)}
                placeholder="Veg/Non-Veg"
                style={styles.textInputStyling}
              />
            </View>
            <TouchableOpacity
              style={styles.buttonOuterStyling}
              onPress={handleFilterButtonClick}>
              <Text style={styles.buttonInnerStyling}>Apply</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  navbarWrapping: {
    backgroundColor: 'rgb(194 65 12)',
    // backgroundColor: 'white',
    padding: 12,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  mainSearchInput: {
    flex: 1,
    borderColor: 'black',
    borderWidth: 1,
    borderRadius: 7,
    backgroundColor: 'rgb(241 245 249)',
    padding: 8,
    marginRight: 10,
  },
  filterIcon: {
    padding: 10,
  },
  expandedFilters: {
    marginTop: 10,
  },
  itemCollection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  inputContainer: {
    flex: 1,
  },
  outerTextStyling: {
    color: 'white',
    marginBottom: 5,
  },
  textInputStyling: {
    borderColor: 'black',
    borderWidth: 1,
    borderRadius: 7,
    color: 'black',
    padding: 8,
    backgroundColor: 'rgb(241 245 249)',
  },
  buttonOuterStyling: {
    backgroundColor: 'rgb(59 130 246)',
    padding: 12,
    borderRadius: 10,
    alignSelf: 'flex-end',
  },
  buttonInnerStyling: {
    color: 'white',
    fontSize: 15,
  },
});

export default NavbarProductPage;
