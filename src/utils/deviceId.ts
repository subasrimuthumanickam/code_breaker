// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { v4 as uuidv4 } from "uuid";

// const KEY = "codebreaker_device_id";

// export async function getDeviceId(): Promise<string> {
//   let id = await AsyncStorage.getItem(KEY);
//   if (!id) {
//     id = uuidv4();
//     await AsyncStorage.setItem(KEY, id);
//   }
//   return id;
// }
import "react-native-get-random-values";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { v4 as uuidv4 } from "uuid";

const KEY = "codebreaker_device_id";

export async function getDeviceId(): Promise<string> {
  let id = await AsyncStorage.getItem(KEY);
  if (!id) {
    id = uuidv4();
    await AsyncStorage.setItem(KEY, id);
  }
  return id;
}