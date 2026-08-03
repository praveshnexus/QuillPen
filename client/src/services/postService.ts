import api from "../api/axios";

export const createPost = async (data: { title: string; content: string }) => {
  const response = await api.post("/posts", data);

  return response.data;
};

export const getAllPosts = async (page = 1) => {
  const response = await api.get(`/posts?page=${page}`);

  return response.data;
};
export const getPostById = async (id: string) => {
  const response = await api.get(`/posts/id/${id}`);

  return response.data;
};

export const getSinglePost = async (slug: string) => {
  const response = await api.get(`/posts/${slug}`);

  return response.data;
};

export const updatePost = async (
  id: string,
  data: {
    title: string;
    content: string;
  },
) => {
  const response = await api.put(`/posts/${id}`, data);

  return response.data;
};

export const deletePost = async (id: string) => {
  const response = await api.delete(`/posts/${id}`);
  return response.data;
};


export const searchPosts = async (query: string) => {
  const response = await api.get(`/posts/search?query=${query}`);
  return response.data;
};