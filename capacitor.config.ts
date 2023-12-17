import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.starter',
  appName: 'devdactivApp',
  webDir: 'www',
  server: {
    androidScheme: 'https'
  },plugins: {
    "@capacitor/storage": {}
  }
};

export default config;
