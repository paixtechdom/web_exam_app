import axios from "axios"
import { useEffect } from "react"
import { useState } from "react"
import { DangerButtonCLass, dbLocation, PrimaryButtonCLass, SecondaryButtonCLass, TextInputClass } from "../../../../assets/Constants"
import { useDispatch, useSelector } from "react-redux"
import { useMyAlert } from "../../../../assets/Hooks/useMyAlert"
import { useMyConfirmBox } from "../../../../assets/Hooks/useMyConfirmBox"
import { setConfirmedAction } from "../../../../assets/store/ConfirmBoxSlice"
import { ExamQuestionInterface, FetchExamQuestion, setExamStatus, setQuestions } from "../../../../assets/store/ExamSlice"
import { AppDispatch, RootState } from "../../../../assets/store/AppStore"


interface EditQuestionInterface {
    editQuestionInfo: ExamQuestionInterface;
    questionNo: number;
    noOfQuestions: number;
    UpdateTotalScore: any
}

export const EditQuestion = ({ editQuestionInfo, questionNo, noOfQuestions, UpdateTotalScore } :EditQuestionInterface) =>{

    const dispatch = useDispatch<AppDispatch>()
    const confirmedAction = useSelector((state:RootState) => state.confirmBox.confirmedAction)  
    
    const {  examKey, questions } = useSelector((state:RootState) => state.examslice)  
    // const examKey = examstate.examKey
    const triggerAlert = useMyAlert()
    const useConfirmBox = useMyConfirmBox()

    const [ updatedQuestion, setUpdatedQuestion ] = useState(false)
    const [ deleteClicked, setDeleteClicked ] = useState(false)

    // set the default info of questions to the existing ones
    const [ newQuestionInfo, setNewQuestionInfo ] = useState<ExamQuestionInterface>({
        optionA: editQuestionInfo.optionA,
        optionB: editQuestionInfo.optionB,
        optionC: editQuestionInfo.optionC,
        optionD: editQuestionInfo.optionD,
        question: editQuestionInfo.question,
        answer: editQuestionInfo.answer,
        points: editQuestionInfo.points == 0 ? 1 : editQuestionInfo.points ,
        questionType: editQuestionInfo.questionType == "" ? "multiple-choice" : editQuestionInfo.questionType       
    })
    

    // Check for errors with options before updating
    const updateExamQuestion = (newQuestionInfo: ExamQuestionInterface) =>{
        if(newQuestionInfo.questionType == "true/false"){
            newQuestionInfo.optionC = "";
            newQuestionInfo.optionD = "";
        }

        if(newQuestionInfo.answer.length < 1){
            triggerAlert("error", "No answer selected")
            return;
        }         

        
        if(newQuestionInfo.questionType == "true/false"){
            if(newQuestionInfo.optionA.trim() == "" || newQuestionInfo.optionB.trim() == ""){
                triggerAlert("error", "Options cannot be empty")
                return;
            }
            
            if(newQuestionInfo.optionA != newQuestionInfo.optionB ){
                UpdateAfterVerificaton()        
                return
            }
            triggerAlert("error", "Two or more options cannot be the same")
            
            
        }

        if(newQuestionInfo.questionType == "multiple-choice"){
            if(newQuestionInfo.optionA.trim() == "" || newQuestionInfo.optionB.trim() == "" || newQuestionInfo.optionC.trim() == "" || newQuestionInfo.optionD.trim() == ""){
                triggerAlert("error", "Options cannot be empty")
                return;
            }
            
            if(newQuestionInfo.optionA != newQuestionInfo.optionB && newQuestionInfo.optionA != newQuestionInfo.optionC && newQuestionInfo.optionA != newQuestionInfo.optionD && newQuestionInfo.optionB != newQuestionInfo.optionC && newQuestionInfo.optionB != newQuestionInfo.optionD && newQuestionInfo.optionC != newQuestionInfo.optionD ){
                UpdateAfterVerificaton()
                return;
            }
            triggerAlert("error", "Two or more options cannot be the same")
        }        
    }

    const UpdateAfterVerificaton = async () => {
        // console.table(newQuestionInfo)
        await axios.post(`${dbLocation}/examquestions.php/${editQuestionInfo.id}/save`, newQuestionInfo).then(function() {
            UpdateTotalScore(newQuestionInfo.points, questionNo-1)
            setUpdatedQuestion(false)
            triggerAlert("success", `Question ${questionNo} Updated Successfully`)
            dispatch(FetchExamQuestion(examKey))
        })
    }



    useEffect(() => {
        // to check if any change has been made to the question, covering the aspects listed in the array, parameters

        const parameters:(keyof ExamQuestionInterface)[] = ["optionA", "optionB", "optionC", "optionD", "answer", "points", "questionType", "question"]
        let i = 0
        parameters.forEach((parameter) => {
            if(editQuestionInfo[parameter] !== newQuestionInfo[parameter]){
                i += 1
            }else{
            }
        })
        if(i == 0){
            setUpdatedQuestion(false)
        }else{
            setUpdatedQuestion(true)
        }
        
    }, [newQuestionInfo])


    useEffect(() => {
        // to set option a and b default value to True and False, respectively
        if(newQuestionInfo.questionType == "true/false"){
            setNewQuestionInfo({
                ...newQuestionInfo,
                optionA: "True",
                optionB: "False"
            })

            // to set answer to an empty string if the initial answer is C or D
            if(newQuestionInfo.answer == "C" || newQuestionInfo.answer == "D"){
            setNewQuestionInfo({
                ...newQuestionInfo,
                answer: ""
            })
            }
        }
    }, [newQuestionInfo.questionType])

 
    const HandleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>{
        setNewQuestionInfo({
            ...newQuestionInfo,
            [e.target.name]: (e.target.value)
        })
    }

    useEffect(() => {
        if(confirmedAction && deleteClicked){        
            deleteQuestion()    
            dispatch(setConfirmedAction(false))
            setDeleteClicked(false)
        }
    }, [confirmedAction])

    

    const deleteQuestion = async () => {       
        await axios.delete(`${dbLocation}/examquestions.php/${editQuestionInfo.id}/delete`)
        .then(() => {
            dispatch(setQuestions(questions.filter((e) => e.id != editQuestionInfo.id)))

            
            // dispatch(FetchExamQuestion(examKey))
            triggerAlert("success", `Question ${questionNo} deleted successfully`)
            UpdateTotalScore()
            
            noOfQuestions < 6 && 
            axios.post(`${dbLocation}/exams.php/${examKey}/Inactive`)
                .then(() => dispatch(setExamStatus("Inactive")))
            }).catch(() => {
                triggerAlert("error", `Failed to delete Question ${questionNo}`)
            })
        
        
    }

    return(

        <section className={`flex w-11/12 mt-9 bg-gray-100 rounded-xl overflow-hidden shadow-xl h-fit `}>

            <div className="center bg-gray-50 h- [100] w-6 cursor-grab hover:bg-gray-300 active:bg-gray-300 transition-all duration-500 ease-in-out">
                <i className="bi bi-grid-fill"></i>
            </div>

            <div className="flex flex-col gap-4 w-full p-4 py-5 lg:p-9 lg:py-9">

                <div className="flex flex-col w-full gap-5 lg:gap-9">
                    {/* Question Type and Point */}
                    <div className="flex justify-between">
                        <div className="flex items-center gap-2 lg:gap-3">
                            <p className="bg-white p-2 rounded-lg w-9 h-8 center shadow-md font-bold">
                                {questionNo}
                            </p>
                            
                            <select name="questionType" id="" value={newQuestionInfo.questionType} onChange={(e) => HandleChange(e)}
                            
                            className='outline-none bg-none bg-transparent min-w-[150px] font-bold text-gray-600 cursor-pointer'>
                                <option value="multiple-choice">Multiple Choice</option>
                                <option value="true/false">True / False</option>
                            </select>
                        </div>

                        <div className="flex items-center gap-2 lg:gap-3">


                            <button className='center hover:scale-90 active:scale-90 bg-white hover:bg-gray-200 active:bg-gray-200 h-8 w-8 text-xl rounded transition-all duration-500 shadow'
                            onClick={()=> {
                                setNewQuestionInfo({
                                    ...newQuestionInfo,
                                    points: newQuestionInfo.points ==  1 ? 1 : newQuestionInfo.points - 1 
                                })
                            }}
                            >-</button>
                            <p>{newQuestionInfo.points} Pt</p>
                            <button className='center hover:scale-90 active:scale-90 bg-white hover:bg-gray-200 active:bg-gray-200 h-8 w-8 text-xl rounded transition-all duration-500 shadow'
                            onClick={()=> {
                                setNewQuestionInfo({
                                    ...newQuestionInfo,
                                    points: newQuestionInfo.points == 5 ? 5 : newQuestionInfo.points + 1
                                })
                                
                            }}
                            >+</button>



                        </div>
                    </div>

                    {/* Question */}
                    <div className="flex flex-col gap-2 w-full">
                        <div className="center flex-col lg:flex-row gap-2 lg:gap-3 w-full">
                            <label htmlFor="question" className='text-lg font-bold text-gray-700 w-full lg:w-fit'>Question</label>

                            <input className={TextInputClass + " w-full"} type="text" placeholder="Enter Question" required value={newQuestionInfo.question}
                            name="question"
                            onChange={(e) => HandleChange(e)}
                            /> 

                        </div>

                    </div>

                    <div className="flex flex-col gap-9 justify-between md:grid md:grid-cols-2">

                        <div className={'flex items-center w-full gap-2 lg:gap-3'}>
                            <p className={`text-l font-bold rounded-full w-10 h-9 shadow center cursor-pointer ${newQuestionInfo.answer == "A" ? "bg-green-800 text-white" : "text-gray-600  hover:bg-green-100"}`}
                            onClick={() => {
                                setNewQuestionInfo({
                                    ...newQuestionInfo,
                                    answer: "A"
                                })
                            }}
                            >A</p>
                            <input 
                                className={TextInputClass + ` w-full ${newQuestionInfo.answer =="A" ? "bg-green-100" : ""} `} 
                                type="text" 
                                name="optionA"
                                placeholder="Enter Option A"  
                                value={newQuestionInfo.optionA}
                                onChange={(e) => HandleChange(e)}
                                required
                                readOnly={newQuestionInfo.questionType == "true/false"}
                            />
                        </div>
                        
                        <div className={'flex items-center w-full gap-2 lg:gap-3'}>
                            <p className={`text-l font-bold rounded-full w-10 h-9 shadow center cursor-pointer ${newQuestionInfo.answer == "B" ? "bg-green-800 text-white" : "text-gray-600  hover:bg-green-100"}`}
                            onClick={() => {
                                setNewQuestionInfo({
                                    ...newQuestionInfo,
                                    answer: "B"
                                })
                            }}
                            >B</p>
                            <input 
                                className={TextInputClass + ` w-full ${newQuestionInfo.answer =="B" ? "bg-green-100" : ""} `} 
                                type="text" 
                                name="optionB"
                                placeholder="Enter Option B"  
                                value={newQuestionInfo.optionB}
                                onChange={(e) => HandleChange(e)}
                                required
                                readOnly={newQuestionInfo.questionType == "true/false"}
                            />
                        </div>
                
                        {   newQuestionInfo.questionType !== "true/false" &&
                            <>
                                <div className={'flex items-center w-full gap-2 lg:gap-3'}>
                                    <p className={`text-l font-bold rounded-full w-10 h-9 shadow center cursor-pointer ${newQuestionInfo.answer == "C" ? "bg-green-800 text-white" : "text-gray-600  hover:bg-green-100"}`}
                                    onClick={() => {
                                        setNewQuestionInfo({
                                            ...newQuestionInfo,
                                            answer: "C"
                                        })
                                    }}
                                    >C</p>
                                    <input 
                                        className={TextInputClass + ` w-full ${newQuestionInfo.answer =="C" ? "bg-green-100" : ""} `} 
                                        type="text" 
                                        name="optionC"
                                        placeholder="Enter Option C"  
                                        value={newQuestionInfo.optionC}
                                        onChange={(e) => HandleChange(e)}
                                        required={newQuestionInfo.questionType == "multiple-choice"}
                                        readOnly={newQuestionInfo.questionType == "true/false"}
                                    />
                                </div>

                                <div className={'flex items-center w-full gap-2 lg:gap-3'}>
                                    <p className={`text-l font-bold rounded-full w-10 h-9 shadow center cursor-pointer ${newQuestionInfo.answer == "D" ? "bg-green-800 text-white" : "text-gray-600  hover:bg-green-100"}`}
                                    onClick={() => {
                                        setNewQuestionInfo({
                                            ...newQuestionInfo,
                                            answer: "D"
                                        })
                                    }}
                                    >D</p>
                                    <input 
                                        className={TextInputClass + ` w-full ${newQuestionInfo.answer =="D" ? "bg-green-100" : ""} `} 
                                        type="text" 
                                        name="optionD"
                                        placeholder="Enter Option D"  
                                        value={newQuestionInfo.optionD}
                                        onChange={(e) => HandleChange(e)}
                                        required={newQuestionInfo.questionType == "multiple-choice"}
                                        readOnly={newQuestionInfo.questionType == "true/false"}
                                    />
                                </div>
                            </> 
                        }

                    </div>

                </div>
                
                <div className="flex itemx-center gap-3 lg:gap-6 mt-6">
                    <button 
                        className={`${updatedQuestion ? PrimaryButtonCLass : SecondaryButtonCLass} w-fit disabled:cursor-not-allowed disabled:opacity-70`} 
                        disabled={!updatedQuestion} 
                        onClick={() =>  {
                        updateExamQuestion(newQuestionInfo)}}> 
                        Update 
                    </button>

                    <button 
                        className={`${DangerButtonCLass} w-fit `}
                        onClick={() =>  {
                            setDeleteClicked(true)
                            useConfirmBox('Confirm to delete Question ' + questionNo + '?' , "Question: " + newQuestionInfo.question)
                        }}> 
                        Delete
                    </button>

                </div>

            </div>

        </section>
    )

}