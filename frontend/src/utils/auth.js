const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

const handleResponse = async (response) => {
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || `Error: ${response.status}`);
  }

  return data;
};

export const register = (email, password) => fetch(`${BASE_URL}/signup`, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({ email, password }),
}).then(handleResponse);

export const login = (email, password) => fetch(`${BASE_URL}/signin`, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({ email, password }),
}).then(handleResponse);

export const checkToken = (token) => fetch(`${BASE_URL}/users/me`, {
  method: "GET",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  },
}).then(handleResponse);
