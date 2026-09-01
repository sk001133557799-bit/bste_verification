@echo off
echo ===================================================
echo 📱 BSTE ISLAMABAD — ANDROID APK BUILD GENERATOR
echo ===================================================
echo.
echo Select your APK build method:
echo 1. Build Standalone APK via Expo Cloud (No Android Studio required)
echo 2. Generate Local Android Project & Gradle APK
echo 3. Start Live Expo Development Server
echo.
set /p choice="Enter your choice (1, 2, or 3): "

if "%choice%"=="1" (
    echo.
    echo 🚀 Starting EAS Cloud APK Build...
    echo You will receive a direct .apk download link upon completion.
    npx -y eas-cli build -p android --profile preview
) else if "%choice%"=="2" (
    echo.
    echo ⚙️ Generating Android Native Code...
    npx expo prebuild --platform android
    cd android
    call gradlew assembleRelease
    echo.
    echo ✅ APK generated at: mobile\android\app\build\outputs\apk\release\app-release.apk
) else (
    echo.
    echo 📲 Starting Live Metro Bundler for Expo Go...
    npx expo start --android
)
pause
