import api from "../api/axios";

export const likePost= async (postid : string)=>{
   const response= await api.post(`/posts/${postid}/like`);

  return response.data;

}

export const unlikePost= async (postid : string)=>{
   const response= await api.delete(`/posts/${postid}/like`);
  
  return response.data;

}

export const getLikeStatus= async (postid: string)=>{
  const response= await api.get(`/posts/${postid}/like/status`);

  return response.data;
}


export const getLikeCount = async (postid: string)=>{
  const response = await api.get(`/posts/${postid}/like/count`);

  return response.data;
};