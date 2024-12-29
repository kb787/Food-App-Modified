import ProductDataFetching from './ProductDataFetching';
import NavbarProductPage from './NavbarProductPage';
import {View, SafeAreaView, ScrollView, StyleSheet} from 'react-native';
const MainProductScreen = () => {
  return (
    <SafeAreaView>
      <ScrollView>
        <View>
          <ProductDataFetching />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default MainProductScreen;

const styles = StyleSheet.create({});
