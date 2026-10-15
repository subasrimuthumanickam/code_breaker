// // Backend URL. Real phone: use your PC LAN IP (ipconfig). Port 4000 = your server.js
// export const BT_API='http://192.168.1.5:4000/api/braintwist';
import { Platform } from 'react-native';

// Phone-la test panna mattum: ipconfig-la IPv4 address-a inga podunga
const LAN_IP = '192.168.1.5';

export const BT_API =
  Platform.OS === 'web'
    ? 'http://localhost:4000/api/braintwist'
    : `http://${LAN_IP}:4000/api/braintwist`;