import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// Use proxy in both dev and production to avoid CORS issues
const API_BASE_URL = "/api/v1";

interface DeviceRegistrationData {
  deviceUuid: string;
  type: string;
  status: string;
  ipAddress: string;
  metadata: {
    deviceModel: string;
    osVersion: string;
    appVersion: string;
    platformId: string;
  };
}

interface TokenResponse {
  access_token: string;
  token_type?: string;
  expires_in?: number;
  [key: string]: any;
}

const AdminLogin: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");

  // Step 1: Device Registration
  const [deviceId, setDeviceId] = useState<number | null>(() => {
    const saved = localStorage.getItem("admin_device_id");
    return saved ? parseInt(saved, 10) : null;
  });
  const [deviceUuid, setDeviceUuid] = useState<string>(() => {
    const saved = localStorage.getItem("admin_device_uuid");
    return saved || "";
  });

  // Step 2: OTP Generation
  const [phone, setPhone] = useState<string>("");

  // Step 3: Login
  const [otp, setOtp] = useState<string>("");

  // Generate device UUID on mount if not exists
  useEffect(() => {
    if (!deviceUuid) {
      const generateUUID = () => {
        return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
          const r = (Math.random() * 16) | 0;
          const v = c === "x" ? r : (r & 0x3) | 0x8;
          return v.toString(16).toUpperCase();
        });
      };
      const newUuid = generateUUID();
      setDeviceUuid(newUuid);
      localStorage.setItem("admin_device_uuid", newUuid);
    }
  }, [deviceUuid]);

  // Auto-advance to step 2 if device is already registered
  useEffect(() => {
    if (deviceId && step === 1) {
      setStep(2);
    }
  }, [deviceId, step]);

  // Get IP address
  const getIPAddress = async (): Promise<string> => {
    try {
      const response = await fetch("https://api.ipify.org?format=json");
      const data = await response.json();
      return data.ip || "192.168.1.100";
    } catch {
      return "192.168.1.100";
    }
  };

  // Step 1: Register Device
  const handleDeviceRegistration = async () => {
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const ipAddress = await getIPAddress();
      const deviceData: DeviceRegistrationData = {
        deviceUuid: deviceUuid,
        type: "MOBILE_APP",
        status: "ACTIVE",
        ipAddress: ipAddress,
        metadata: {
          deviceModel: navigator.userAgent.includes("Mac") ? "Mac" : navigator.userAgent.includes("Windows") ? "Windows PC" : "Unknown",
          osVersion: navigator.platform,
          appVersion: "1.0.0",
          platformId: "WEB",
        },
      };

      const response = await fetch(`${API_BASE_URL}/devices`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(deviceData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Device registration failed: ${response.statusText}`);
      }

      const data: any = await response.json();
      
      // Handle API response structure: { body: { id: ... }, statusCode: 200, ... }
      const id = data.body?.id || data.id || data.deviceId || data.data?.id || data.data?.deviceId;
      
      if (!id) {
        console.error("Device registration response:", data);
        throw new Error("Device ID not found in response. Please check the API response structure.");
      }
      
      setDeviceId(id);
      localStorage.setItem("admin_device_id", id.toString());
      setSuccess("Device registered successfully!");
      setTimeout(() => {
        setStep(2);
        setSuccess("");
      }, 1500);
    } catch (err: any) {
      setError(err.message || "Failed to register device. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Generate OTP
  const handleGenerateOTP = async () => {
    setLoading(true);
    setError("");
    setSuccess("");

    if (!phone || phone.length < 10) {
      setError("Please enter a valid phone number");
      setLoading(false);
      return;
    }

    if (!deviceId) {
      setError("Device ID is missing. Please register device first.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/auth/otp/generate`, {
        method: "POST",
        headers: {
          "x-device-id": deviceUuid,
          "x-platform": "WEB",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contact: phone,
          contactType: "PHONE",
          deviceId: deviceId,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `OTP generation failed: ${response.statusText}`);
      }

      await response.json(); // Consume response
      setSuccess("OTP sent successfully to your phone!");
      setTimeout(() => {
        setStep(3);
        setSuccess("");
      }, 1500);
    } catch (err: any) {
      setError(err.message || "Failed to generate OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Step 3: Login with OTP
  const handleLogin = async () => {
    setLoading(true);
    setError("");
    setSuccess("");

    if (!otp || otp.length < 4) {
      setError("Please enter a valid OTP");
      setLoading(false);
      return;
    }

    if (!deviceId) {
      setError("Device ID is missing. Please start over.");
      setLoading(false);
      return;
    }

    try {
      const params = new URLSearchParams({
        device_id: deviceId.toString(),
        grant_type: "phone",
        otp: otp,
        phone: phone,
      });

      const response = await fetch(`${API_BASE_URL}/auth/token`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: params.toString(),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Login failed: ${response.statusText}`);
      }

      const data: TokenResponse = await response.json();
      
      if (data.access_token) {
        // Save access token to localStorage
        localStorage.setItem("admin_access_token", data.access_token);
        localStorage.setItem("admin_device_id", deviceId.toString());
        localStorage.setItem("admin_phone", phone);
        
        setSuccess("Login successful! Redirecting...");
        setTimeout(() => {
          // Navigate to admin dashboard (to be created later)
          navigate("/admin/dashboard");
        }, 1500);
      } else {
        throw new Error("Access token not received");
      }
    } catch (err: any) {
      setError(err.message || "Failed to login. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl p-8 space-y-6">
          {/* Header */}
          <div className="text-center">
            <h1 className="text-3xl font-bold text-[#1E40AF] mb-2">Admin Login</h1>
            <p className="text-gray-600">NaArni Admin Dashboard</p>
            <div className="mt-4 flex justify-center space-x-2">
              <div className={`h-2 w-2 rounded-full ${step >= 1 ? "bg-blue-600" : "bg-gray-300"}`}></div>
              <div className={`h-2 w-2 rounded-full ${step >= 2 ? "bg-blue-600" : "bg-gray-300"}`}></div>
              <div className={`h-2 w-2 rounded-full ${step >= 3 ? "bg-blue-600" : "bg-gray-300"}`}></div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
              {success}
            </div>
          )}

          {/* Step 1: Device Registration */}
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Device UUID
                </label>
                <input
                  type="text"
                  value={deviceUuid}
                  readOnly
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
                />
                <p className="mt-1 text-xs text-gray-500">Auto-generated device identifier</p>
              </div>
              {!deviceId && (
                <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-2 rounded-lg text-sm">
                  Error: Device ID not found. Please register device first.
                </div>
              )}
              <button
                onClick={handleDeviceRegistration}
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold py-3 rounded-lg shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Registering Device..." : deviceId ? "Re-register Device" : "Register Device"}
              </button>
            </div>
          )}

          {/* Step 2: Generate OTP */}
          {step === 2 && (
            <div className="space-y-4">
              {!deviceId ? (
                <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-2 rounded-lg text-sm">
                  Device ID not found. Please register device first.
                </div>
              ) : (
                <div className="bg-green-50 border border-green-50 text-green-900 px-4 py-2 rounded-lg text-sm">
                  All Okay
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                  placeholder="Enter your phone number"
                  maxLength={10}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
                <p className="mt-1 text-xs text-gray-500">Enter your 10-digit phone number</p>
              </div>
              <div className="flex space-x-3 gap-2">
                <button
                  onClick={() => setStep(1)}
                  className="flex-1 bg-gray-200 text-gray-700 font-semibold py-3 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={handleGenerateOTP}
                  disabled={loading || !phone}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold py-3 rounded-lg shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Sending OTP..." : "Send OTP"}
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Login with OTP */}
          {step === 3 && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Enter OTP
                </label>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                  placeholder="1990"
                  maxLength={6}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-center text-2xl tracking-widest"
                />
                <p className="mt-1 text-xs text-gray-500">Enter the OTP sent to {phone}</p>
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={() => setStep(2)}
                  className="flex-1 bg-gray-200 text-gray-700 font-semibold py-3 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={handleLogin}
                  disabled={loading || !otp}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold py-3 rounded-lg shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Logging in..." : "Login"}
                </button>
              </div>
              <button
                onClick={handleGenerateOTP}
                className="w-full text-sm text-blue-600 hover:text-blue-700 underline"
              >
                Resend OTP
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;

