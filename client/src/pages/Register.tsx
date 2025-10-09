/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect } from 'react'
import "../css/register.css"
import { useForm } from 'react-hook-form';
import { postUser } from '../apis/userAPI';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { useDispatch, useSelector } from 'react-redux';
import { getAllUsers } from '../store/slices/userSlice';
import type { User } from '../utils/type';
type Data = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
};
export default function Register() {
    const { register, handleSubmit, watch, formState: { errors } } = useForm<Data>();
    const navigate = useNavigate();
    const dispatch: any = useDispatch();
    const users = useSelector((data: {users: {users: User[]}})=>{
        return data.users.users;
    });
    const password = watch("password");
    const userSubmit= async (data: Data)=>{
        try {
            await postUser({firstName: data.firstName, lastName: data.lastName, password: data.password, email: data.email, id: null, role: "user"});
            Swal.fire({
              title: "Đăng ký thành công",
              icon: "success",
            });
            navigate("/login");
        } catch (error) {
            console.error(error);
        }
    }
    useEffect(()=>{
        dispatch(getAllUsers());
    }, [dispatch]);
  return (
    <div>
      <div className='header'>
        <div className="logo"  onClick={()=>navigate("/")}>VocabApp</div>
        <div className='buttons'>
            <button onClick={()=>navigate("/login")} className='login'>Login</button>
            <button onClick={()=>navigate("/register")} className='register'>Register</button>
        </div>
      </div>
      <div className='body'>
        <form action="" className='form-container' onSubmit={handleSubmit(userSubmit)}>
            <h1>Register</h1>
            <div>
                <label htmlFor="">First Name</label>
                <input {...register("firstName", { required: "Họ không được để trống" })} type="text" />
                <p className='redWarning'>{errors.firstName?.message}</p>
            </div>
            <div>
                <label htmlFor="">Last Name</label>
                <input {...register("lastName", { required: "Tên không được để trống" })} type="text" />
                <p className='redWarning'>{errors.lastName?.message}</p>
            </div>
            <div>
                <label htmlFor="">Email</label>
                <input {...register("email", { required: "Email không được để trống", validate: {isEmail: (value) => (value.endsWith(".com") && value.includes("@")) || "Email không đúng định dạng",
                                                                                                  isUnique: (value) => !users.some((user) => user.email == value) || "Email đã tồn tại"}})} type="text" />
                <p className='redWarning'>{errors.email?.message}</p>
            </div>
            <div>
                <label htmlFor="">Password</label>
                <input {...register("password", { required: "Mật khẩu không được để trống", minLength: { value: 8, message: "Mật khẩu tối thiểu 8 ký tự" } })} type="password" />
                <p className='redWarning'>{errors.password?.message}</p>
            </div>
            <div>
                <label htmlFor="">Confirm Password</label>
                <input {...register("confirmPassword", { required: "Xác nhận mật khẩu không được để trống", validate: value => value === password || "Mật khẩu xác nhận phải trùng khớp" })} type="password" />
                <p className='redWarning'>{errors.confirmPassword?.message}</p>
            </div>
            <button type='submit' className='registerButton'>Register</button>
        </form>
      </div>
    </div>
  )
}
