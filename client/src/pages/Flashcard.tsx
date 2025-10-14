/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react'
import "../css/flashcard.css"
import { useDispatch, useSelector } from 'react-redux'
import type { Category, Vocabulary } from '../utils/type';
import { getAllFlashcards, getAllVocabularies, updateVocabulary } from '../store/slices/vocabularySlice';
import { getAllCategories } from '../store/slices/categorySlice';
import { getAllVocabulary } from '../apis/vocabularyAPI';
export default function Flashcard() {
  const categories: Category[] = useSelector((data: {categories: {categories: Category[]}})=>{
    return data.categories.categories;
  });
  const [search, setSearch] = useState<number>(0);
  const vocabularies: Vocabulary[] = useSelector((data: {vocabularies: {vocabularies: Vocabulary[]}})=>{
    return data.vocabularies.vocabularies;
  });
  const totalPages: number = useSelector((data: {vocabularies: {totalPages: number}})=>{
    return data.vocabularies.totalPages
  });
  const flashcards: Vocabulary[] = useSelector((data: {vocabularies: {flashcards: Vocabulary[]}})=>{
    return data.vocabularies.flashcards;
  });
  const totalFlashcards: number = useSelector((data: {vocabularies: {totalFlashcards: number}})=>{
    return data.vocabularies.totalFlashcards;
  });
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [currentWord, setCurrentWord] = useState<number>(1);
  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  const [allVocab, setAllVocab] = useState<Vocabulary[]>();
  const learnedWordsCount = allVocab?.filter((item) => item.isLearned == true).length ?? 0;
  const totalWordsCount = allVocab?.length ?? 0
  const progressPercent = totalWordsCount > 0 ? (learnedWordsCount / totalWordsCount) * 100 : 0;

  const dispatch: any = useDispatch();

  const paginate=()=>{
    const pageButtons = [];
    for (let i = 1; i <= totalPages; i++) {
      pageButtons.push(
        <button
          key={i}
          className={`page-btn ${currentPage === i ? "active" : ""}`}
          onClick={() => setCurrentPage(i)}
        >
          {i}
        </button>
      );
    }
    return pageButtons;
  }

  const markAsLearned = async ()=>{
    if(flashcards.length != 0){
      await dispatch(updateVocabulary({...flashcards[0], isLearned: !flashcards[0].isLearned}));
      dispatch(getAllFlashcards({currentPage: currentWord, search: search, limit: 1}));
      const res = await getAllVocabulary({currentPage: 1, search: {wordSearch: "", categorySearch: search}, limit: 999});
      setAllVocab(res.data);
    }else{
      return
    }
  }

  useEffect(()=>{
    dispatch(getAllVocabularies({currentPage: currentPage, search:{wordSearch: "", categorySearch: search}, limit: 5}));
    dispatch(getAllFlashcards({currentPage: currentWord, search: search, limit: 1}));
    
  }, [dispatch, currentPage, currentWord, search]);

  useEffect(() => {
    dispatch(getAllCategories({currentPage: 1, search: "", limit: 999}));
  }, []);
  
  useEffect(()=>{
    setIsFlipped(false);
  }, [currentWord]);

  useEffect(()=>{
    getAllVocabulary({currentPage: 1, search: {wordSearch: "", categorySearch: search}, limit: 999})
    .then((res)=>{
      setAllVocab(res.data);
    })
  }, [search])
  return (
    <div className='container'>
      <div className='content'>
        <h1 className='title'>Flashcard Learning</h1>
          <select name='categorySearch' onChange={(e)=>{setSearch(+e.target.value); setCurrentWord(1); setCurrentPage(1)}} className='selectCategory'>
            <option value={0} defaultValue={0}>All Categories</option>
            {categories.length == 0 ? <option disabled>Không có danh mục</option> 
            : 
            categories.map((category) => {
                return <option key={category.id} value={category.id!}>{category.name}</option>
            })}
        </select>
        <div className={`flipCard ${isFlipped ? "flipped" : ""}`}>
          <div className='innerFlipCard' onClick={()=>setIsFlipped(!isFlipped)}>
            <div className='front'>
              <h1>{flashcards.length!=0 ? flashcards[0].word : "No words available"}</h1>
            </div>
            <div className='back'>
              <h1>{flashcards.length!=0 ? flashcards[0].meaning : "No words available"}</h1>
            </div>
          </div>
        </div>
        <div className='buttonLine'>
          <button disabled={currentWord==1} className='previous' onClick={()=>setCurrentWord(currentWord-1)}>Previous</button>
          <button className={flashcards[0]?.isLearned ? "unmarkAsLearned" : "markAsLearned"} onClick={markAsLearned}>{flashcards[0]?.isLearned ? "Unmark as learned" : "Mark as learned"}</button>
          <button disabled={currentWord==totalFlashcards} className='next' onClick={()=>setCurrentWord(currentWord+1)}>Next</button>
        </div>
        <div className='progressBar'>
          <div className='wordLine'>
            <p>Progress</p>
            <p>{learnedWordsCount}/{totalWordsCount}</p>
          </div>
          <div className='outerProgress'>
            <div style={{ width: `${progressPercent}%` }} className='innerProgress'></div>
          </div>
        </div>
        <h2>Word List</h2>
        <table className='table'>
            <thead>
                <tr>
                    <th id='word'>WORD</th>
                    <th id='meaning'>MEANING</th>
                    <th id='status'>STATUS</th>
                </tr>
            </thead>
            <tbody>
              {vocabularies.map((vocabulary) => {
                return <tr key={vocabulary.id}>
                  <td>{vocabulary.word}</td>
                  <td>{vocabulary.meaning}</td>
                  <td className={vocabulary.isLearned? "learned" : ""}>{vocabulary.isLearned ? "Learned" : "Not Learned"}</td>
                </tr>
              })}
            </tbody>
        </table>
        <div className="pagination">
          <button
            className="page-btn"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(currentPage - 1)}
          >
            &lt;
          </button>

          {paginate()}

          <button
            className="page-btn"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(currentPage + 1)}
          >
            &gt;
          </button>
        </div>
      </div>
    </div>
  )
}
