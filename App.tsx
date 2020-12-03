import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  FlatList,
  Dimensions,
  ListRenderItemInfo,
  SafeAreaView,
} from "react-native";
import React, { useState } from "react";
import axios from "axios";

//画面の大きさを取得
const screenWidth = Dimensions.get("screen").width;
const screenHeight = Dimensions.get("screen").height;

//APIのベースとなるURLを変数に代入
const apiBaseURL = "https://zipcloud.ibsnet.co.jp/api/search";

export default function App() {
  //入力されたpostCodeがzipcodeに入る
  const [zipcode, setZipcode] = useState<string>("");
  const [addressList, setAddressList] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  //ボタンが押されたときに始まる処理
  const updateScreenAsyn = async () => {
    //読み込み中にする
    setIsLoading(true);

    // 住所情報を取得
    try {
      const addressList = await getAddressInfo(zipcode);
      if (addressList === null) {
        alert("住所が取得できませんでした。ﾋﾟｴﾝ");
      } else {
        setAddressList(addressList);
      }
    } catch (error) {
      alert(error);
    }
    //読み込み終了
    setIsLoading(false);
  };

  // 住所を取得する
  const getAddressInfo = async (zipcode: string) => {
    const requestConfig = {
      baseURL: apiBaseURL, 
      params: { zipcode: zipcode }
    };

    //取得した情報を変数respomceに格納し、必要な情報だけaddressListとして返す
    const responce = await axios(requestConfig);
    console.log(responce);
    const addressList = responce.data.results;
    
    return addressList;
  };

  const loadingView = <Text>Loading</Text>;

  const renderAddressItem = ({ item }: ListRenderItemInfo<any>) => {
      return (
        <Text>
          {item.address1}
          {item.address2}
          {item.address3}
        </Text>
      );
  };

  const listContainerView = (
    <View>
      <FlatList
        data={addressList}
        renderItem={renderAddressItem}
        keyExtractor={(item, index) => `${index}`}
      />
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.userContainer}>
        <TextInput
          onChangeText={(postCode) => setZipcode(postCode)}
          style={styles.inputText}
          keyboardType="numeric"
          placeholder="郵便番号"
          maxLength={7}
        />

        <TouchableOpacity style={styles.button} onPress={updateScreenAsyn}>
          <Text style={styles.buttonText}>住所を取得</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.list}>
        {isLoading ? loadingView : listContainerView}
      </View>

      <StatusBar style="auto" />
    </SafeAreaView>
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
    textAlign: "left",
    padding: 10,
    margin: 5,
    fontSize: 30,
    backgroundColor: "#fff",
    color: "#000",
    width: "50%",
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
    width: screenWidth * 0.8,
    borderWidth: 3,
    borderColor: "#000000",
    height: screenHeight * 0.5,
  },
});
