// Custom Hook for Authentication
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { storage } from "../utils/storage";

export const useAuth = () => {
  const navigate = useNavigate();
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const accessToken = storage.get("ACCESS_TOKEN");
    if (!accessToken) {
      navigate("/admin/login");
    } else {
      setToken(accessToken);
    }
  }, [navigate]);

  const logout = () => {
    storage.clear();
    navigate("/admin/login");
  };

  return { token, logout };
};

