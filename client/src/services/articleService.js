import api from "../api/axios";

export const getArticles = () => api.get("/articles");

export const getArticle = (id) => api.get(`/articles/${id}`);

export const searchArticles = (query) =>
  api.get(`/articles?search=${query}`);

export const getFeaturedArticles = () =>
  api.get("/articles/featured");