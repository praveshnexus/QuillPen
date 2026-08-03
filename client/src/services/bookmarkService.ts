import api from "../api/axios";

export const bookmarkPost= async (postid: string)=>{
   const response = await api.post(`/posts/${postid}/bookmark`);

   return response.data;
}


export const removeBookmark= async (postid: string)=>{
   const response = await api.delete(`/posts/${postid}/bookmark`);

   return response.data;
}


export const getBookmarkStatus= async (postid: string)=>{
   const response = await api.get(`/posts/${postid}/bookmark/status`);

   return response.data;
}

export const getMyBookmarks = async () => {
  const response = await api.get("/bookmarks");

  return response.data;
};
