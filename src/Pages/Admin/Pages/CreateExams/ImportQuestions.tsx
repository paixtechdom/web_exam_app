import axios from "axios"
import { FC, useRef, useState } from "react"
import { dbLocation, PrimaryButtonCLass, SecondaryButtonCLass } from "../../../../assets/Constants"
import { useMyAlert } from "../../../../assets/Hooks/useMyAlert"
import { useDispatch } from "react-redux"
import { FetchExamQuestion } from "../../../../assets/store/ExamSlice"
import { AppDispatch } from "../../../../assets/store/AppStore"

interface a {
    examKey: string,
    setExamStatus: any
}

export const ImportQuestions:FC<a> = ({examKey, setExamStatus}) =>{
    const [ doc, setDoc ] = useState(null)
    const triggerAlert = useMyAlert()
    const fileRef = useRef<HTMLInputElement>(null)
    const dispatch = useDispatch<AppDispatch>()
    
  
    const setFile = (e: any) =>{2
       const inputedFile = e.target.files[0]
    //    console.log(inputedFile)
       if(inputedFile == undefined){
           e.target.value = null
           setDoc(null)
          
       }else{
        if(inputedFile.type === 'text/csv' ){
            setDoc(inputedFile)
        }
        else{
            triggerAlert("error", 'File must be in csv format')
            e.target.value = null
        }
       }

       }
        
       const postFile = () => {
        if (!doc) return;
    
        const formData = new FormData();
        formData.append("file", doc); // "file" must match the key expected in PHP
    
        axios.post(`${dbLocation}/examquestions.php/${examKey}/save`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        }).then(function(response) {
            if (response.data.status == 1) {
                dispatch(FetchExamQuestion(examKey));
    
                triggerAlert("success", 'Questions successfully imported');
    
                setDoc(null);
                axios.post(`${dbLocation}/exams.php/${examKey}/Inactive`);
                setExamStatus('Inactive');
            } else {
                triggerAlert("error", 'Failed to import questions');
            }
        }).catch((error) => {
            console.log(error);
            triggerAlert("error", 'Failed to import questions');
        });
    };
    



    return(
        <div className="flex flex-wrap gap-5 items-center">
            <input type="file" name="file" accept=".csv"  id="file" 
            onChange={setFile}  
            ref ={fileRef}
            className={doc != null ? `bg-gray-200 p-2 rounded-r-xl shadow-lg` : undefined }
            style={{
                display: doc == null ? 'none' : 'block' 
            }}
            />

            <button 
            className={`${doc == null ? 'block' : 'hidden'} ${SecondaryButtonCLass}`}
             onClick={() =>{
                fileRef.current?.click()
            }}>
                Import questions 
            </button>

            <button name="file" onClick={() => postFile()} 
            className={`${doc == null ? 'hidden' : 'block'} ${PrimaryButtonCLass}`}
            >Import</button>
        </div>
    )
}