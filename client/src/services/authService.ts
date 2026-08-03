import api from "../api/axios";

export const signupUser = async (data: {
  name: string;
  email: string;
  password: string;
}) => {
  const response = await api.post(
    "/auth/signup",
    data
  );

  return response.data;
};

export const loginUser = async (data: {
  email: string;
  password: string;
}) => {
  const response = await api.post(
    "/auth/login",
    data
  );

  return response.data;
};