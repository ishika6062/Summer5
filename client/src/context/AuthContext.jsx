import { createContext, useContext, useEffect, useMemo, useState } from "react";

const AuthContext = createContext(undefined);

const TOKEN_KEY = "auth_token";
const USER_KEY = "auth_user";

const readStoredUser = () => {
  const raw = localStorage.getItem(USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:4000";
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY) || "");
  const [user, setUser] = useState(() => readStoredUser());

  const setAuth = ({ token: nextToken, user: nextUser }) => {
    setToken(nextToken || "");
    setUser(nextUser || null);
  };

  const logout = () => {
    setToken("");
    setUser(null);
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  };

  const fetchMe = async (overrideToken = token) => {
    if (!overrideToken) return null;

    const response = await fetch(`${apiUrl}/api/auth/me`, {
      headers: {
        Authorization: `Bearer ${overrideToken}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to load user");
    }

    const data = await response.json();
    setUser(data.user);
    return data.user;
  };

  useEffect(() => {
    if (token) {
      localStorage.setItem(TOKEN_KEY, token);
    } else {
      localStorage.removeItem(TOKEN_KEY);
    }
  }, [token]);

  useEffect(() => {
    if (user) {
      localStorage.setItem(USER_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(USER_KEY);
    }
  }, [user]);

  useEffect(() => {
    if (token && !user) {
      fetchMe().catch(() => logout());
    }
  }, [token, user]);

  const value = useMemo(
    () => ({
      apiUrl,
      token,
      user,
      isAuthenticated: Boolean(token && user),
      setAuth,
      fetchMe,
      logout,
    }),
    [apiUrl, token, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
