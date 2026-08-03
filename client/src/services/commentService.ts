import api from "../api/axios";

export const createComment = async (
  id: string,
  data: {
    content: string;
  },
) => {
  const response = await api.post(`/posts/${id}/comments`, data);

  return response.data;
};


export const getCommentsByPost = async (id: string)=>{
  const response= await api.get(`/posts/${id}/comments`);

  return response.data;
}

export const deleteComment = async (postid: string,commentid: string)=>{
  const response= await api.delete(`/posts/${postid}/comments/${commentid}`);
  
  return response.data;
}


