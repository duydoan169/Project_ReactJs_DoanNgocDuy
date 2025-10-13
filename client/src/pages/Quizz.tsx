import React, { useState } from 'react'
import "../css/quizz.css"
export default function Quizz() {
  const [option1, setOption1] = useState<{isChosen: boolean, style: string}>({isChosen: false, style: ""});
  const [option2, setOption2] = useState<{isChosen: boolean, style: string}>({isChosen: false, style: ""});
  return (
    <div className='quizzContainer'>
      <div className='content'>
        <div className='titleLine'>
            <h1 className='title'>Vocabulary Quizz</h1>
            <button>Start Quizz</button>
        </div>
        <select className='selectCategory' name="" id="" defaultValue={""}>
        <option value="" hidden disabled>All Category</option>
        </select>
        <div className='progressBar'>
          <div className='wordLine'>
            <p>Progress</p>
            <p>1/2</p>
          </div>
          <div className='outerProgress'>
            <div style={{ width: "50%"}} className='innerProgress'></div>
          </div>
        </div>
        <div className='quizz'>
          <h1 className='title'>What is the meaning of "Cat"</h1>
          <div className={`answer ${option1.style}`} onClick={()=> option1.isChosen ? setOption1({isChosen: false, style: ""}) : (Math.random()*10 > 5 ? setOption1({isChosen: true, style: "correct"}) : setOption1({isChosen: true, style: "wrong"}))}>mèo</div>
          <div className={`answer ${option2.style}`} onClick={()=> option2.isChosen ? setOption2({isChosen: false, style: ""}) : (Math.random()*10 > 5 ? setOption2({isChosen: true, style: "correct"}) : setOption2({isChosen: true, style: "wrong"}))}>cún</div>
        </div>
        <div className='buttons'>
          <button>Previous</button>
          <button>Next</button>
        </div>
        <h2>Quizz History</h2>
        <table>
          <thead>
              <tr>
                  <th id='date'>DATE</th>
                  <th id='category'>CATEGORY</th>
                  <th id='score'>SCORE</th>
              </tr>
          </thead>
          <tbody>
            <tr>
                <td>15/08/2011</td>
                <td>Toán học</td>
                <td>8/20</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}
