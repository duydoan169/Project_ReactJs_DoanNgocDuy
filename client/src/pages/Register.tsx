import React from 'react'
import "../css/register.css"
import { useForm } from 'react-hook-form';
import { postUser } from '../apis/userAPI';
import { useNavigate } from 'react-router-dom';
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
    const password = watch("password");
    const userSubmit= async (data: Data)=>{
        try {
            const user = await postUser({...data, id: null, role: "user"});
            localStorage.setItem("currentUser", JSON.stringify(user));
            navigate("/");
        } catch (error) {
            console.error(error);
        }
    }
  return (
    <div>
      <div className='header'>
        <div className="logo">VocabApp</div>
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
                <input {...register("email", { required: "Email không được để trống", validate: (value) => (value.endsWith(".com") && value.includes("@")) || "Email không đúng định dạng"})} type="text" />
                <p className='redWarning'>{errors.email?.message}</p>
            </div>
            <div>
                <label htmlFor="">Password</label>
                <input {...register("password", { required: "Mật khẩu không được để trống", minLength: { value: 8, message: "Mật khẩu tối thiểu 8 ký tự" } })} type="password" />
                <p className='redWarning'>{errors.password?.message}</p>
            </div>
            <div>
                <label htmlFor="">Confirm password</label>
                <input {...register("confirmPassword", { required: "Xác nhận mật khẩu không được để trống", validate: value => value === password || "Mật khẩu xác nhận phải trùng khớp" })} type="password" />
                <p className='redWarning'>{errors.confirmPassword?.message}</p>
            </div>
            <button type='submit'>Register</button>
        </form>
      </div>
    </div>
  )
}
