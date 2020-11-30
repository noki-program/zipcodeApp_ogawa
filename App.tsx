import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  FlatList,
  Dimensions,
} from "react-native";
import React, { useState, useCallback } from "react";
import axios from "axios";

const { width } = Dimensions.get("screen");
const screenHeight = Dimensions.get("screen").height;

const apiBaseURL = "https://zipcloud.ibsnet.co.jp/api/search";

export default function App() {
  const [zipcode, setZipcode] = useState<number>();
  const [address, setAddress] = useState();
  const [isLoading, setIsLoading] = useState(false);

  const updateScreenAsyn = async () => {
    setIsLoading(true); //読み込み中にする

    // 住所情報を取得
    try {
      const address = await getAddress(zipcode);
      setAddress(address);
    } catch (error) {
      alert(error);
    }

    setIsLoading(false); //読み込み終了
  };

  // 住所を取得する;
  const getAddress = async (zipcode: number) => {
    const requestConfig = {
      baseURL: apiBaseURL,
      params: { zipcode },
    };

    const responce = await axios(requestConfig);
    const address = responce.data.results;
    console.log(address);
    console.log("-----------------------");
    return address;
  };

  const loadingView = <Text>Loading</Text>;

  const renderAddressInfo = () => {
    let addressArray = [];

    for (let i = 0; i < 3; i++) {
      addressArray.push(address[i].address1);
      addressArray.push(address[i].address2);
      addressArray.push(address[i].address3);
    }

    return <Text>{addressInfoItem}</Text>;
  };

  const listContainerView = (
    <View>
      <FlatList
        data={address}
        renderItem={renderAddressInfo}
        keyExtractor={(item) => item.id}
        style={styles.listItem}
      />
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.userContainer}>
        <TextInput
          onChangeText={(postCode) => setZipcode(postCode)}
          style={styles.inputText}
          keyboardType="numeric"
        />

        <TouchableOpacity style={styles.button} onPress={updateScreenAsyn}>
          <Text style={styles.buttonText}>住所を取得</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.list}>
        {isLoading ? loadingView : listContainerView}
      </View>

      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#808080",
    alignItems: "center",
    justifyContent: "center",
  },

  userContainer: {
    flexDirection: "row",
    position: "absolute",
    top: "30%",
    justifyContent: "center",
  },

  inputText: {
    textAlign: "right",
    padding: 10,
    margin: 5,
    fontSize: 30,
    backgroundColor: "#fff",
    color: "#000",
    width: "45%",
    borderWidth: 3,
    borderColor: "#000000",
  },

  button: {
    alignItems: "center",
    backgroundColor: "#a197e2",
    padding: 10,
    justifyContent: "center",
    borderRadius: 30,
    margin: 5,
    borderWidth: 3,
    borderColor: "#000000",
  },

  buttonText: {
    fontSize: 20,
  },

  list: {
    position: "absolute",
    top: "40%",
    backgroundColor: "#fff",
    width: width * 0.8,
    borderWidth: 3,
    borderColor: "#000000",
    height: screenHeight * 0.5,
  },

  listItem: {},
});
