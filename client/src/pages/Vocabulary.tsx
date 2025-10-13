/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react'
import "../css/vocabulary.css"
import { useDispatch, useSelector } from 'react-redux';
import type { Category, Vocabulary } from '../utils/type';
import { addVocabulary, getAllVocabularies, removeVocabulary, updateVocabulary } from '../store/slices/vocabularySlice';
import { useForm } from 'react-hook-form';
import Swal from 'sweetalert2';
import { getAllCategories } from '../store/slices/categorySlice';
import { getAllVocabulary } from '../apis/vocabularyAPI';
export default function Vocabularies() {
  const [addModal, setAddModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const dispatch: any = useDispatch();
  const vocabularies: Vocabulary[] = useSelector((data: {vocabularies: {vocabularies: Vocabulary[]}})=>{
    return data.vocabularies.vocabularies;
  });
  const totalPages: number = useSelector((data: {vocabularies: {totalPages: number}})=>{
    return data.vocabularies.totalPages
  })
  const categories: Category[] = useSelector((data: {categories: {categories: Category[]}})=>{
      return data.categories.categories;
    });
  const [edit, setEdit] = useState<Vocabulary | null>(null);
  const {register, handleSubmit, reset, formState: { errors }, setError}=useForm<{word: string, meaning: string, categoryId: number}>();
  const [page, setPage] = useState<number>(1);
  const [search, setSearch] = useState<{wordSearch: string, categorySearch: number}>({wordSearch: "", categorySearch: 0});
  
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>)=>{
    const {name, value} = e.target
    setSearch({...search, [name]: value});
    setPage(1);
  }
  const handleDelete= async (id: number)=>{
    await dispatch(removeVocabulary(id));
    setDeleteModal(false);
    setPage(1);
    dispatch(getAllVocabularies({currentPage: page, search: search, limit: 5}));
    Swal.fire({
      title: "Xóa thành công",
      icon: "success",
    });
  }
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
  const userSubmit = async (data: {word: string, meaning: string, categoryId: number})=>{
    try {
      const fullVocab = (await getAllVocabulary({currentPage: 1, search: {wordSearch: "", categorySearch: 0}, limit: 999})).data;
      if(!fullVocab.some((vocabulary: Vocabulary) => vocabulary.word == data.word)){
        if(edit){
          await dispatch(updateVocabulary({...edit, ...data}));
          dispatch(getAllVocabularies({currentPage: page, search: search, limit: 5}));
          Swal.fire({
            title: "Sửa thành công",
            icon: "success",
          });
        }else{
          await dispatch(addVocabulary({id: null, isLearned: false, ...data}));
          dispatch(getAllVocabularies({currentPage: page, search: search, limit: 5}));
          Swal.fire({
            title: "Thêm thành công",
            icon: "success",
          });
        }
        setAddModal(false)
      }else{
        setError("word",{type: "custom", message: "Từ này đã tồn tại"})
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(()=>{
    if(edit){
      reset({word: edit.word, meaning: edit.meaning, categoryId: edit.categoryId});
    }else{
      reset({word: "", meaning: "", categoryId: 0});
    }
  }, [addModal, reset, edit]);

  useEffect(()=>{
    dispatch(getAllVocabularies({currentPage: page, search: search, limit: 5}));
  }, [dispatch, page, search]);

  useEffect(()=>{
    dispatch(getAllCategories({currentPage: page, search: "", limit: 999}));
  }, []);
  return (
    <div className='container'>
      <div className='content'>
        <div className='titleLine'>
            <h1>Vocabulary Words</h1>
            <button className='addButton' onClick={()=>{setEdit(null); setAddModal(true)}}>Add New Word</button>
        </div>
        <select name='categorySearch' onChange={handleSearch} className='selectCategory'>
            <option value={0} defaultValue={0}>All Categories</option>
            {categories.length == 0 ? <option disabled>Không có danh mục</option> 
            : 
            categories.map((category) => {
                return <option key={category.id} value={category.id!}>{category.name}</option>
            })}
        </select>
        <input name='wordSearch' onChange={handleSearch} type="text" placeholder='Search vocabularies...'/>
        <table>
            <thead>
                <tr>
                    <th id='word'>WORD</th>
                    <th id='meaning'>MEANING</th>
                    <th id='category'>CATEGORY</th>
                    <th id='actions'>ACTIONS</th>
                </tr>
            </thead>
            <tbody>
                {vocabularies.map((vocabulary) => {
                  return <tr key={vocabulary.id}>
                            <td>{vocabulary.word}</td>
                            <td>{vocabulary.meaning}</td>
                            <td>{categories.find((category) => category.id == vocabulary.categoryId)?.name}</td>
                            <td>
                                <button className='editButton' onClick={()=>{setEdit(vocabulary); setAddModal(true)}}>Edit</button>
                                <button className='deleteButton' onClick={()=>{setDeleteId(vocabulary.id); setDeleteModal(true)}}>Delete</button>
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
              <p className='title'>{edit ? "Edit Vocabulary" : "Add Vocabulary"}</p>
              <p onClick={()=>{setAddModal(false)}}>X</p>
            </div>
            <hr />
            <form action="" onSubmit={handleSubmit(userSubmit)}>
              <div className='content'>
                <div>
                    <label htmlFor="">Word</label>
                    <input type="text" {...register("word", {required: "Từ không được để trống"})}/>
                    <p className='redWarning'>{errors.word?.message}</p>
                </div>
                <div>
                    <label htmlFor="">Meaning</label>
                    <textarea {...register("meaning", {required: "Nghĩa không được để trống"})}></textarea>
                    <p className='redWarning'>{errors.meaning?.message}</p>
                </div>
                <div>
                    <label htmlFor="">Category</label>
                    <select {...register("categoryId", {validate: value => value != 0 || "Danh mục không được để trống"})}>
                        <option value={0} defaultValue={0} hidden>Select Category</option>
                        {categories.length == 0 ? <option disabled>Không có danh mục</option> 
                        : 
                        categories.map((category) => {
                            return <option key={category.id} value={category.id!}>{category.name}</option>
                        })}
                    </select>
                    <p className='redWarning'>{errors.categoryId?.message}</p>
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
              <p className='title'>Delete Vocabulary</p>
              <p onClick={()=>{setDeleteModal(false)}}>X</p>
            </div>
            <hr />
            <div className='content'>
              <p>Are you sure you want to delete this word?</p>
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
