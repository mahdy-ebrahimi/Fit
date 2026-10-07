import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'ir.fitgen.pro',
  appName: 'فیت‌ژن پرو',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
    cleartext: true,
  },
  android: {
    allowMixedContent: true,
    backgroundColor: '#070b14',
    buildOptions: {
      keystorePath: 'release-key.keystore',
      keystoreAlias: 'fitgen',
    },
  },
};

export default config;
