import axios from "axios";
import type { Vocabulary } from "../utils/type";

export const getAllVocabulary = async ({currentPage, search, limit}: {currentPage: number, search: {wordSearch: string, categorySearch: number}, limit: number}) => {
  const categorySearch = search.categorySearch == 0 ? "" : search.categorySearch;
  const res = await axios.get(`http://localhost:8080/vocabularies?word_like=${search.wordSearch}&categoryId_like=${categorySearch}&_page=${currentPage}&_limit=${limit}`);
  return {
    data: res.data,
    totalPages: Math.ceil(+res.headers["x-total-count"] / limit)
  }
}

export const postVocabulary = async (data: Vocabulary)=>{
    const res = await axios.post("http://localhost:8080/vocabularies", data);
    return res.data;
}

export const deleteVocabulary = async (id: number)=>{
  await axios.delete(`http://localhost:8080/vocabularies/${id}`);
  return id;
}

export const patchVocabulary = async (data: Vocabulary)=>{
  const res = await axios.patch(`http://localhost:8080/vocabularies/${data.id}`, data);
  return res.data;
}