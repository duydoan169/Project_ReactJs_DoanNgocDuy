import axios from "axios";
import type { User } from "../utils/type";

export const getAllUser = async () => {
  const res = await axios.get("http://localhost:8080/users");
  return res.data;
}

export const postUser = async (data: User)=>{
    const res = await axios.post("http://localhost:8080/users", data);
    return res.data;
}