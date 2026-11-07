import axios from "axios";

const API_URL = "http://localhost:5027/api/users";

export const getUsers = async () => {
    const response = await axios.get(API_URL);
    return response.data;
};

export const getUserById = async (id) => {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
};

export const createUser = async (user, token) => {
  const response = await axios.post(API_URL, user, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  return response.data;
};

export const updateUser = async (id, user) => {
    const response = await axios.put(`${API_URL}/${id}`, user);
    return response.data;
};

export const deleteUser = async (id) => {
    await axios.delete(`${API_URL}/${id}`);
};