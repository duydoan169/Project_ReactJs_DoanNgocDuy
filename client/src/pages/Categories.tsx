/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react'
import "../css/categories.css"
import { useDispatch, useSelector } from 'react-redux';
import type { Category } from '../utils/type';
import { addCategory, getAllCategories, removeCategory, updateCategory } from '../store/slices/categorySlice';
import { useForm } from 'react-hook-form';
import Swal from 'sweetalert2';
import { getAllCategory } from '../apis/categoryAPI';
export default function Categories() {
  const [addModal, setAddModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const dispatch: any = useDispatch();
  const categories: Category[] = useSelector((data: {categories: {categories: Category[]}})=>{
    return data.categories.categories;
  });
  const totalPages: number = useSelector((data: {categories: {totalPages: number}})=>{
    return data.categories.totalPages
  })
  const [edit, setEdit] = useState<Category | null>(null);
  const {register, handleSubmit, reset, formState: { errors }, setError}=useForm<{name: string, description: string}>();
  const [page, setPage] = useState<number>(1);
  const [search, setSearch] = useState<string>("");
  const paginate=()=>{
    const pageButtons = [];
    for (let i = 1; i <= totalPages; i++) {
      pageButtons.push(
        <button
          key={i}
          className={`page-btn ${page === i ? "active" : ""}`}
          onClick={() => setPage(i)}
        >
          {i}
        </button>
      );
    }
    return pageButtons;
  }
  const handleDelete= async (id: number)=>{
    await dispatch(removeCategory(id));
    setDeleteModal(false);
    setPage(1);
    dispatch(getAllCategories({currentPage: page, search: search, limit: 5}));
    Swal.fire({
      title: "Xóa thành công",
      icon: "success",
    });
  }
  const userSubmit = async (data: {name: string, description: string})=>{
    try {
      const fullCategories = (await getAllCategory({currentPage: 1, search: "", limit: 999})).data;
      if(!fullCategories.some((category: Category) => category.name == data.name && category.id!=edit?.id)){
        if(edit){
          await dispatch(updateCategory({...edit, ...data}));
          dispatch(getAllCategories({currentPage: page, search: search, limit: 5}));
          Swal.fire({
            title: "Sửa thành công",
            icon: "success",
          });
        }else{
          await dispatch(addCategory({id: null, createdAt: new Date().toLocaleString("vi-VN"), ...data}));
          dispatch(getAllCategories({currentPage: page, search: search, limit: 5}));
          Swal.fire({
            title: "Thêm thành công",
            icon: "success",
          });
        }
        setAddModal(false)
      }else{
        setError("name", {type: "custom", message: "Danh mục đã tồn tại"});
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(()=>{
    if(edit){
      reset({name: edit.name, description: edit.description});
    }else{
      reset({name: "", description: ""});
    }
  }, [addModal, reset, edit]);

  useEffect(()=>{
    dispatch(getAllCategories({currentPage: page, search: search, limit: 5}));
  }, [dispatch, page, search]);

  return (
    <div className='container'>
      <div className='content'>
        <div className='titleLine'>
            <h1>Vocabulary Categories</h1>
            <button className='addButton' onClick={()=>{setEdit(null); setAddModal(true)}}>Add new Category</button>
        </div>
        <input onChange={(e)=>{setSearch(e.target.value); setPage(1)}} type="text" placeholder='Search categories...'/>
        <table>
            <thead>
                <tr>
                    <th id='name'>NAME</th>
                    <th id='description'>DESCRIPTION</th>
                    <th id='actions'>ACTIONS</th>
                </tr>
            </thead>
            <tbody>
                {categories.map((category) => {
                  return <tr key={category.id}>
                            <td>{category.name}</td>
                            <td>{category.description}</td>
                            <td>
                                <button className='editButton' onClick={()=>{setEdit(category); setAddModal(true)}}>Edit</button>
                                <button className='deleteButton' onClick={()=>{setDeleteId(category.id); setDeleteModal(true)}}>Delete</button>
                            </td>
                        </tr>
                })}
            </tbody>
        </table>
        <div className="pagination">
          <button
            className="page-btn"
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
          >
            &lt;
          </button>

          {paginate()}

          <button
            className="page-btn"
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
          >
            &gt;
          </button>
        </div>
      </div>
      {(addModal || deleteModal) && <div className='modalBackground'>
        {addModal && <div className='addModal'>
            <div className="titleLine">
              <p className='title'>{edit ? "Edit Category" : "Add Category"}</p>
              <p onClick={()=>{setAddModal(false)}}>X</p>
            </div>
            <hr />
            <form action="" onSubmit={handleSubmit(userSubmit)}>
              <div className='content'>
              <div>
                <label htmlFor="">Name</label>
                <input type="text" {...register("name", {required: "Tên không được để trống"})}/>
                <p className='redWarning'>{errors.name?.message}</p>
              </div>
              <div>
                <label htmlFor="">Description</label>
                <textarea {...register("description", {required: "Mô tả không được để trống"})}></textarea>
                <p className='redWarning'>{errors.description?.message}</p>
              </div>
              </div>
              <hr />
              <div className='buttons'>
                <button type='button' onClick={()=>{setAddModal(false)}} className='cancelButton'>Cancel</button>
                <button type='submit' className='saveButton'>Save</button>
              </div>
            </form>
          </div>}
          {deleteModal && <div className='deleteModal'>
            <div className="titleLine">
              <p className='title'>Delete Category</p>
              <p onClick={()=>{setDeleteModal(false)}}>X</p>
            </div>
            <hr />
            <div className='content'>
              <p>Are you sure you want to delete this category?</p>
            </div>
            <hr />
            <div className='buttons'>
              <button onClick={()=>{setDeleteModal(false)}} className='cancelButton'>Cancel</button>
              <button onClick={()=>handleDelete(deleteId!)} type='submit' className='deleteButton'>Delete</button>
            </div>
          </div>}
      </div>}
    </div>
  )
}
