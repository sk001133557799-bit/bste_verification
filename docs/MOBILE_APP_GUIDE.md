# Board of Science and Technical Education (BSTE) Islamabad
## Official Mobile Application Architecture & Deployment Manual

**Platforms:** Android (Google Play Store) & iOS (Apple App Store)  
**Technology Stack:** React Native (Expo SDK 51), TypeScript, Axios, React Navigation 6, Async Storage  
**Application Bundle ID / Package:** `pk.edu.bste.results`  

---

## 1. Mobile Architecture & Design Topology

The BSTE mobile application provides a fast, native client for candidates, faculty, and board administrators.

```mermaid
graph TD
    App[BSTE Mobile App / React Native] --> Nav[React Navigation / Tabs & Stacks]
    Nav --> Screens[Screens: Home, Verification, QRScanner, Notices, Login, Dashboards]
    Screens --> API[Mobile API Client / Axios with Auth Interceptor]
    API --> Cache[AsyncStorage / Offline Search & Gazette Cache]
    API --> Endpoints[/api/v1/mobile/* Microservice Endpoints]
```

### Key Architectural Decisions:
1. **React Native with Expo SDK 51:**
   - Unified TypeScript models shared with Next.js and NestJS.
   - Native camera and barcode scanning via `expo-camera` / `expo-barcode-scanner`.
   - Native document sharing and printing via `expo-sharing` and `expo-print`.
2. **Offline-First Result Caching:**
   - Previous verified result cards and gazette circulars are automatically cached to local encrypted storage (`AsyncStorage`).
   - If a candidate scans a certificate without internet connectivity, the cached cryptographic record resolves seamlessly.
3. **Public Unauthenticated Lookups:**
   - Students, employers, and verifying agencies can search roll numbers and scan QR codes without creating an account.
4. **Role-Aware Faculty & Admin Access:**
   - Faculty members log in to access departmental metrics and candidate registration.
   - Board administrators log in to inspect live examination KPIs and the pending approvals review queue.

---

## 2. Screen Directory & Features

1. **Splash Screen:** Official BSTE Gold Seal branding and environment initialization.
2. **Home Screen (`mobile/src/screens/HomeScreen.tsx`):**
   - Instant roll number search box with quick sample roll number pills.
   - Gazette breaking news ticker.
   - Quick action shortcuts for **Scan QR Seal** and **Gazette Circulars**.
   - Recent search history drawer.
3. **Student Verification Screen (`mobile/src/screens/VerificationScreen.tsx`):**
   - Official watermarked result card with Guilloche border.
   - Candidate photo, Roll No, Reg No, Masked CNIC (`61101-*******-3`).
   - Subject marks breakdown table (Theory Max/Obtained, Practical Max/Obtained, Grade).
   - Final Result Summary (Total Marks, Percentage, GPA, Letter Grade, Pass/Fail status).
   - Signatory seal of Controller of Examinations and 2D QR Code.
   - Native OS Share & Print integration.
4. **QR Scanner Screen (`mobile/src/screens/QRScannerScreen.tsx`):**
   - High-performance camera scanner with animated corner guides.
   - Instant decoding of BSTE certificate verification URLs.
   - Green **"VERIFIED AUTHENTIC"** confirmation modal with student name, program, and certificate number.
5. **Gazette & Notifications Screen (`mobile/src/screens/NotificationsScreen.tsx`):**
   - Filterable circulars stream (Results, Date Sheets, Admissions, Circulars) with pull-to-refresh.
6. **Staff & Faculty Login Screen (`mobile/src/screens/LoginScreen.tsx`):**
   - Role-based login for Instructors and Board Controllers with secure JWT token storage.
7. **Teacher Dashboard Screen (`mobile/src/screens/TeacherDashboardScreen.tsx`):**
   - Assigned student metrics, pending batches, and departmental candidates.
8. **Admin Dashboard Screen (`mobile/src/screens/AdminDashboardScreen.tsx`):**
   - Real-time examination KPIs and pending batch approval queue.

---

## 3. Local Development & Testing Instructions

1. **Navigate to Mobile Directory:**
   ```bash
   cd mobile
   npm install
   ```
2. **Start Expo Development Server:**
   ```bash
   npx expo start
   ```
3. **Run on Android Emulator or Device:**
   ```bash
   npx expo start --android
   ```
4. **Run on iOS Simulator (macOS):**
   ```bash
   npx expo start --ios
   ```

---

## 4. Google Play Store & Apple App Store Release Workflow

### Android (Google Play Store):
1. **Configure `mobile/app.json`:**
   - Package: `pk.edu.bste.results`
   - Version: `1.0.0`
   - Version Code: `1`
2. **Build Android App Bundle (.aab):**
   ```bash
   eas build --platform android --profile production
   ```
3. **Upload `.aab` to Google Play Console:**
   - Complete Data Safety Questionnaire (discloses camera usage for QR scanning).
   - Upload high-resolution feature graphics (1024x500) and phone screenshots.

### iOS (Apple App Store):
1. **Configure `mobile/app.json`:**
   - Bundle Identifier: `pk.edu.bste.results`
   - Info.plist: `NSCameraUsageDescription` (explains camera use for certificate QR scanning).
2. **Build iOS Archive (.ipa):**
   ```bash
   eas build --platform ios --profile production
   ```
3. **Submit via Transporter to App Store Connect:**
   - Set age rating (4+ Education).
   - Add App Store description, keywords, and screenshots.

---

## 5. Automated Mobile API Test Verification

Run the automated mobile microservice test suite:
```bash
node test_mobile_ecosystem.js
```
Expected Output: **11/11 Mobile API Tests Passing**.
