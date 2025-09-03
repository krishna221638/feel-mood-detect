import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.21183e48b18547899ddacc87ffe10181',
  appName: 'feel-mood-detect',
  webDir: 'dist',
  server: {
    url: "https://21183e48-b185-4789-9dda-cc87ffe10181.lovableproject.com?forceHideBadge=true",
    cleartext: true
  }
};

export default config;