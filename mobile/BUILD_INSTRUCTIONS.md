# BSTE Islamabad — Android APK Build Guide 📱

This guide explains how to generate the standalone `.apk` installer file for **Board of Science & Technical Education Islamabad**.

---

## ⚡ Option 1: 1-Command Cloud APK Build (Recommended)
You do **not** need Android Studio or heavy SDKs installed on your computer.

1. Open PowerShell or Command Prompt in the `mobile/` directory:
   ```bash
   cd "e:\Rsults Verification\mobile"
   ```
2. Run the EAS Build command:
   ```bash
   npx eas-cli build -p android --profile preview
   ```
3. If prompted, log in with your free Expo account (or create one at [expo.dev](https://expo.dev)).
4. Expo's build servers will compile the project and give you a **direct `.apk` download link & QR code** to install on any Android phone!

---

## 💻 Option 2: Local Gradle APK Build (With Android Studio)
If you have Android Studio & Java JDK installed locally:

```bash
cd "e:\Rsults Verification\mobile"
npx expo prebuild --platform android
cd android
./gradlew assembleRelease
```
The output `.apk` file will be generated at:  
📁 `mobile/android/app/build/outputs/apk/release/app-release.apk`

---

## 📲 Option 3: Double-Click Batch Generator
Simply double-click the file:  
👉 [`e:\Rsults Verification\mobile\build_apk.bat`](file:///e:/Rsults%20Verification/mobile/build_apk.bat)
