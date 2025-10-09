import axios from "axios";
import type { Category } from "../utils/type";

export const getAllCategory = async ({currentPage, search, limit}: {currentPage: number, search: string, limit: number}) => {
  const res = await axios.get(`http://localhost:8080/categories?name_like=${search}&_page=${currentPage}&_limit=${limit}`);
  return {
    data: res.data,
    totalPages: Math.ceil(+res.headers["x-total-count"] / limit)
  }
}

export const postCategory = async (data: Category)=>{
    const res = await axios.post("http://localhost:8080/categories", data);
    return res.data;
}

export const deleteCategory = async (id: number)=>{
  await axios.delete(`http://localhost:8080/categories/${id}`);
  return id;
}

export const patchCategory = async (data: Category)=>{
  const res = await axios.patch(`http://localhost:8080/categories/${data.id}`, data);
  return res.data;
}