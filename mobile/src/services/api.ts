import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const API_BASE_URL = "http://localhost:3000/api/v1/mobile";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Intercept requests to inject bearer token
apiClient.interceptors.request.use(async (config) => {
  try {
    const token = await AsyncStorage.getItem("@bste_auth_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch (err) {
    console.error("Token retrieval error:", err);
  }
  return config;
});

export const MobileAPI = {
  // 1. Verify Student by Roll Number (with offline fallback)
  verifyStudent: async (rollNumber: string) => {
    const cleanRoll = rollNumber.trim().toUpperCase();
    try {
      const response = await apiClient.get(`/student/${encodeURIComponent(cleanRoll)}`);
      if (response.data?.success) {
        // Cache search locally
        await AsyncStorage.setItem(`@student_${cleanRoll}`, JSON.stringify(response.data.data));
        // Add to recent search history
        await saveRecentSearch(cleanRoll, response.data.data.student.fullName);
      }
      return response.data;
    } catch (error: any) {
      // Check offline cache
      const cached = await AsyncStorage.getItem(`@student_${cleanRoll}`);
      if (cached) {
        return { success: true, data: JSON.parse(cached), isOffline: true };
      }
      throw error.response?.data?.error || "Network error. Please check your internet connection.";
    }
  },

  // 2. Verify Certificate by ID
  verifyCertificate: async (certificateId: string) => {
    const cleanId = certificateId.trim().toUpperCase();
    try {
      const response = await apiClient.get(`/certificate/${encodeURIComponent(cleanId)}`);
      return response.data;
    } catch (error: any) {
      throw error.response?.data?.error || "Certificate validation failed.";
    }
  },

  // 3. Get Public Notifications & Gazette Circulars
  getNotifications: async (category?: string) => {
    try {
      const response = await apiClient.get("/notifications", {
        params: { category: category !== "ALL" ? category : undefined },
      });
      if (response.data?.success) {
        await AsyncStorage.setItem("@cached_notifications", JSON.stringify(response.data.data));
      }
      return response.data;
    } catch (error) {
      const cached = await AsyncStorage.getItem("@cached_notifications");
      if (cached) {
        return { success: true, data: JSON.parse(cached), isOffline: true };
      }
      return { success: false, data: [] };
    }
  },

  // 4. Staff / Teacher Authentication
  login: async (identifier: string, password: string) => {
    const response = await apiClient.post("/auth/login", { identifier, password });
    if (response.data?.success && response.data.data?.accessToken) {
      await AsyncStorage.setItem("@bste_auth_token", response.data.data.accessToken);
      await AsyncStorage.setItem("@bste_user_profile", JSON.stringify(response.data.data.user));
    }
    return response.data;
  },

  // 5. Teacher Dashboard
  getTeacherDashboard: async () => {
    const response = await apiClient.get("/teacher/dashboard");
    return response.data;
  },

  // 6. Admin Dashboard
  getAdminDashboard: async () => {
    const response = await apiClient.get("/admin/dashboard");
    return response.data;
  },

  // 7. Logout
  logout: async () => {
    await AsyncStorage.removeItem("@bste_auth_token");
    await AsyncStorage.removeItem("@bste_user_profile");
  },
};

// Helper: Save Recent Search History
async function saveRecentSearch(rollNumber: string, studentName: string) {
  try {
    const raw = await AsyncStorage.getItem("@recent_searches");
    let list = raw ? JSON.parse(raw) : [];
    list = list.filter((item: any) => item.rollNumber !== rollNumber);
    list.unshift({ rollNumber, studentName, timestamp: new Date().toISOString() });
    if (list.length > 5) list = list.slice(0, 5);
    await AsyncStorage.setItem("@recent_searches", JSON.stringify(list));
  } catch (err) {
    console.error("Save recent search error:", err);
  }
}
