import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Alert,
  TouchableOpacity,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import env from '../../env';
import MapView from 'react-native-maps';
import {Marker} from 'react-native-maps';
import Geolocation from 'react-native-geolocation-service';
// import Geolocation from '@react-native-community/geolocation';

const TrackLocation = () => {
  const [searchQueryPickup, setSearchQueryPickup] = useState('');
  const [searchQueryDrop, setSearchQueryDrop] = useState('');
  const [mapboxInitialized, setMapboxInitialized] = useState(false);
  const [myCurrentPosition, setMyCurrentPosition] = useState({});

  const accessDirections = async data => {
    const convertedResponse = await data.json();
    const finalResults = convertedResponse.features.center;
    return finalResults;
  };

  // const handleFetchMyCurrentLocation = () => {
  //   if (hasLocationPermission) {
  //     Geolocation.getCurrentPosition(
  //       position => {
  //         return position;
  //       },
  //       error => {
  //         console.log(error.code, error.message);
  //       },
  //       {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
  //     );
  //   }
  // };
  // useEffect(() => {
  //   if (hasLocationPermission) {
  //     handleFetchMyCurrentLocation();
  //   }
  // }, [hasLocationPermission]);
  let myPosition = {};
  // useEffect(() => {
  //   Geolocation.getCurrentPosition(position => {
  //     setMyCurrentPosition({
  //       latitude: position.coords.latitude,
  //       longitude: position.coords.longitude,
  //     });
  //   }).catch(err => {
  //     console.log(err);
  //   });
  // }, []);
  const handleFindLocationsByQuery = async () => {
    if (!searchQueryPickup || !searchQueryDrop) {
      Alert.alert('Entering both fields is mandatory');
    } else {
      const firstResponse = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${searchQueryPickup}.json?access_token=${env.mapbox_access_token}`,
      );
      const output_pickup = accessDirections(firstResponse);
      const secondResponse = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${searchQueryDrop}.json?access_token=${env.mapbox_access_token}`,
      );
      const output_drop = accessDirections(secondResponse);
      let responses = {};
      responses.pickupLocation = output_pickup;
      responses.dropLocation = output_drop;
      responses.latitudeDelta = 0.0922;
      responses.longitudeDelta = 0.0421;
      return responses;
    }
  };

  // const resultMyCordinates = handleFetchMyCurrentLocation();
  const pickupLocationDynamic = {
    latitude: myPosition.latitude,
    longitude: myPosition.longitude,
  };
  const pickupLocationStatic = {
    latitude: 19.3043,
    longitude: 72.859,
  };
  const dropLocation = {
    latitude: 19.0843,
    longitude: 72.836,
  };
  const handleDistanceCalculation = async () => {
    // const functionResponse = handleFindLocationsByQuery();
    const start = pickupLocationStatic;
    const end = dropLocation;
    const result = await fetch(
      `https://api.mapbox.com/directions/v5/mapbox/driving/${start.longitude},${start.latitude};${end.longitude},${end.latitude}?access_token=${env.mapbox_access_token}`,
    );
    if (!result) {
      Alert.alert('Unable to fetch the directions');
    }
    const data = result.json();
    if (
      data.routes &&
      data.routes.length > 0 &&
      data.routes[0].distance !== undefined
    ) {
      const distance = data.routes[0].distance / 1000;
      const avgSpeedTruckInKM_HR = 52;
      const duration = distance / avgSpeedTruckInKM_HR;
      let output = {};
      output.gap = distance;
      output.interval = duration;
      Alert.alert(
        `The distance estimated is ${output.gap} and time required is ${output.interval}`,
      );
    }
    Alert.alert('The data recieved is in invalid format');
  };
  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={{flex: 1}}>
        <MapView
          style={{
            flex: 1,
          }}>
          <Marker
            coordinate={{
              latitude: pickupLocationStatic.latitude,
              longitude: pickupLocationStatic.longitude,
              latitudeDelta:
                Math.abs(
                  pickupLocationStatic.latitude - dropLocation.latitude,
                ) * 1.5,
              longitudeDelta:
                Math.abs(
                  pickupLocationStatic.longitude - dropLocation.longitude,
                ) * 1.5,
            }}
            title="Pickup Location"
          />
          <Marker
            coordinate={{
              latitude: dropLocation.latitude,
              longitude: dropLocation.longitude,
              latitudeDelta:
                Math.abs(
                  pickupLocationStatic.latitude - dropLocation.latitude,
                ) * 1.5,
              longitudeDelta:
                Math.abs(
                  pickupLocationStatic.longitude - dropLocation.longitude,
                ) * 1.5,
            }}
            title="Drop Location"
          />
        </MapView>
        <View style={styles.buttonWrapper}>
          <TouchableOpacity
            style={styles.buttonOuterStyling}
            onPress={handleDistanceCalculation}>
            <Text style={styles.buttonInnerStyling}>Find Route</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default TrackLocation;

const styles = StyleSheet.create({
  buttonOuterStyling: {
    backgroundColor: 'rgb(59 130 246)',
    color: 'white',
    padding: '3%',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    margin: '2%',
  },
  buttonInnerStyling: {
    color: 'white',
    textAlign: 'center',
    fontSize: 18,
  },
  buttonWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
