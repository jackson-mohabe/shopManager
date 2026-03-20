{
  "expo": {
    "name": "ShopManager",
    "slug": "ShopManager",
    "version": "1.0.0",
    "orientation": "portrait",
    "platforms": ["ios", "android", "web"],
    "icon": "./assets/icon.png",
    "userInterfaceStyle": "light",
    "splash": {
      "image": "./assets/splash-icon.png",
      "resizeMode": "contain",
      "backgroundColor": "#2c3e50"
    },
    "android": {
      "package": "com.jackson.shopmanager",
      "versionCode": 1,
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#2c3e50"
      }
    },
    "web": {
      "bundler": "metro",
      "favicon": "./assets/favicon.png"
    },
    "plugins": [
      "expo-sqlite",
      "expo-sharing"
    ]
  }
}