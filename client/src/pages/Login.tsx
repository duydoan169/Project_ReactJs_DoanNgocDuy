/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect } from 'react'
import "../css/login.css"
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import type { User } from '../utils/type';
import { getAllUsers } from '../store/slices/userSlice';
import Swal from 'sweetalert2';
type Data = {
  email: string;
  password: string;
};
export default function Login() {
    const { register, handleSubmit, setError, formState: { errors } } = useForm<Data>();
    const navigate = useNavigate();
    const dispatch: any = useDispatch();
    const users = useSelector((data: {users: {users: User[]}})=>{
        return data.users.users;
    });
    const userSubmit= async (data: Data)=>{
        try {
            for(let i=0; i<users.length; i++){
                if(data.email == users[i].email && data.password == users[i].password){
                    Swal.fire({
                        title: "Đăng nhập thành công",
                        icon: "success",
                    });
                    localStorage.setItem("currentUser", JSON.stringify(users[i]));
                    if(users[i].role == "user"){
                        navigate("/");
                    }else{
                        navigate("/category");
                    }
                }
            }
            setError("email", {type: "custom", message: "Email hoặc mật khẩu không chính xác"});
            setError("password", {type: "custom", message: "Email hoặc mật khẩu không chính xác"});
        } catch (error) {
            console.log(error);
        }
    }
    useEffect(()=>{
        dispatch(getAllUsers());
    }, [dispatch]);
  return (
    <div>
      <div className='header'>
        <div className="logo" onClick={()=>navigate("/")}>VocabApp</div>
        <div className='buttons'>
            <button onClick={()=>navigate("/login")} className='login'>Login</button>
            <button onClick={()=>navigate("/register")} className='register'>Register</button>
        </div>
      </div>
      <div className='body'>
        <form action="" className='form-container' onSubmit={handleSubmit(userSubmit)}>
            <h1>Login</h1>
            <div>
                <label htmlFor="">Email</label>
                <input {...register("email", { required: "Email không được để trống"})} type="text" />
                <p className='redWarning'>{errors.email?.message}</p>
            </div>
            <div>
                <label htmlFor="">Password</label>
                <input {...register("password", { required: "Mật khẩu không được để trống"})} type="password" />
                <p className='redWarning'>{errors.password?.message}</p>
            </div>
            <button type='submit' className='loginButton'>Login</button>
        </form>
      </div>
    </div>
  )
}
