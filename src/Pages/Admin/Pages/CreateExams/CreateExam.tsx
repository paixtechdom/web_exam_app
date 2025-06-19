import { FC, useEffect, useRef, useState } from "react"
import axios from "axios"
import { useNavigate } from "react-router"
import { EditQuestion } from "./EditQuestion"
import Cookie from "js-cookie"
import { ImportQuestions } from "./ImportQuestions"
import { useDispatch, useSelector } from "react-redux"
import { availableDepartments, dbLocation, PrimaryButtonCLass, SecondaryButtonCLass, SuccessButtonClass, TopLevelHeader } from "../../../../assets/Constants"
import AddQuestionForm from "./AddQuestionForm"
import { SetTimeComponent } from "./SetTimeComponent"
import { FetchExamQuestion, setExamDepartment, setExamFaculty, setExamKey, setExamLevel, setExamStatus, setExamTitle, setTotalScore } from "../../../../assets/store/ExamSlice"
import { useMyAlert } from "../../../../assets/Hooks/useMyAlert"
import { useUpdateExamDetails } from "../../../../assets/Hooks/useUpdateExamDetails"
import InfoComponent from "../../../../Components/InfoComponent"
import { AppDispatch, RootState } from "../../../../assets/store/AppStore"

export type AsyncVoidFunction = () => Promise<void>;

interface newExamInfoInterface{
    examTitle: string,
    level: string,
    faculty: string,
    department: string,
    totalScore: number
}



export const CreateExam = () =>{
    const titleRef = useRef<HTMLInputElement>(null)
    const dispatch = useDispatch<AppDispatch>()
    const triggerAlert = useMyAlert()
    const updateExamDetails = useUpdateExamDetails()
    const examstate = useSelector((state:RootState) => state.examslice)  
    const { examKey, examTitle, duration, status, level, faculty, totalScore, department, questions } = useSelector((state:RootState) => state.examslice)   

    const [ editPart, setEditPart ] = useState<string>("")


    const [ newExamInfo, setNewExamInfo ] = useState<newExamInfoInterface>({
        examTitle: examTitle,
        level: level,
        faculty: faculty,
        department: department,

        // added this here ooooooo
        totalScore: 0
    })



    const navigate = useNavigate()
    
    const FetchExam = async (key: string) => {
        await axios.get(`${dbLocation}/exams.php/${key}/fetch`)
        .then((res) => {
            const exam = res.data[0]
            
            if(exam == undefined){
                navigate("/exams/all-exams") 
                // triggerAlert("error", "Error Fetching Exam undefined")
                console.log("Error Fetching Exam undefined")
                return
            }
            
            if((window.document.URL).split("/")[4].toLowerCase() !== exam.examTitle.toLowerCase().replaceAll(" ", "-")){
                // triggerAlert("error", "Error Fetching Exam false url")
                console.log("Error Fetching Exam false url")
                // navigate("/page-not-found")
                return
            }

            updateExamDetails(exam)

        })
        .catch(() => {
            // triggerAlert("error", "Error Fetching Exam no exam")
            console.log("Error Fetching Exam no exam")
            navigate("/exams/all-exams")            
        })
    }
    
    
    const CookiedExamDetails = Cookie.get("examDetails") 
    const CookiedUserDetails = Cookie.get("userDetails") 
    
    useEffect(() =>{
        document.documentElement.scrollTop=0

        if(CookiedUserDetails == "admin"){
            if(CookiedExamDetails !== undefined){
                const a = Cookie.get("examDetails")
                if(a !== undefined){
                    const examDetails = JSON.parse(a)
                    dispatch(setExamKey(examDetails.examKey))
                    dispatch(FetchExamQuestion(examDetails.examKey))
                    FetchExam(examDetails.examKey)
                    updateExamDetails(examDetails)
                }
            }
            else{
                navigate("/exams/all-exams")            
            }
        }else{
            navigate("/")
        }
    }, [])




// to ensure the new exam info is updated with the info in the store after refreshing the page
    useEffect(() => {
        if (CookiedExamDetails !== undefined){
        setNewExamInfo({
            examTitle : examTitle,
            level: level,
            faculty : faculty,
            department : department,
            totalScore: totalScore
        })
    }   
    }, [examstate])
  
    
    const updateExamStatus = async (examKey:string, status:string) =>{
        // let appearance = 0
        // let i = 0
        if(questions){
            if(questions.length < 5 ){
                triggerAlert("error", "You need at least 5 questions to go live")
            }else{
                if(duration < 60){
                    triggerAlert("error", "Time frame is too short for an exam")
                }else{
                    if(status == 'Active'){
                        await axios.post(`${dbLocation}/exams.php/${examKey}/Inactive`).then(() => {
                            triggerAlert("info", "Exam is now inactive")
                            dispatch(setExamStatus( status == 'Active'? 'Inactive' : 'Active'))
                        })
                        
                    }else{
                        await axios.post(`${dbLocation}/exams.php/${examKey}/Active`).then(() => {
                            triggerAlert("success", "Exam is now live")
                            dispatch(setExamStatus( status == 'Active'? 'Inactive' : 'Active'))
                        })
                    }
                }
            }
        }
    }

    // change points, add new question or delete question
    
    const UpdateTotalScore = async (points = 0, index = 0)=> {
        let totalScore = 0
        questions?.forEach((q) => {
            totalScore += q.points
        })
        if(points && index){
            totalScore -= questions[index].points
            totalScore += points
        }else{
        }
        
        await axios.post(`${dbLocation}/exams.php/${totalScore}/totalScore/${examKey}`)
        .catch(() =>{
            triggerAlert("error", "Failed to update Info")
        })
        dispatch(setTotalScore(totalScore))
    }

    // saved question.lenth is to track if a new question has been added
    useEffect(() => {
        UpdateTotalScore()
    }, [questions.length])


    useEffect(() => {
        // to prevent calling running this code before the app state updates hereby deleting all info 
        // editPart = "" when the state is refreshed and  = "epmty" when an edit has ended from the title, dept, level and faculty
        if(editPart !== "" && faculty !== newExamInfo.faculty){
                setNewExamInfo({
                    ...newExamInfo,
                    department: ""
                })
        }
    }, [newExamInfo.faculty])


    const updateExamInfo:AsyncVoidFunction = async () => {
        // console.table(newExamInfo)
        if(newExamInfo.department == ""){
            triggerAlert("info", "Select a department")
        }
        await axios.post(`${dbLocation}/exams.php/update/${examKey}`, newExamInfo)
        .then((res) => {
            if(res.data.status == 1) {
                dispatch(setExamTitle(newExamInfo.examTitle))
                dispatch(setExamLevel(newExamInfo.level))
                dispatch(setExamDepartment(newExamInfo.department))
                dispatch(setExamFaculty(newExamInfo.faculty))
                dispatch(setTotalScore(newExamInfo.totalScore))
                {
                    newExamInfo.department !== "" &&
                    triggerAlert("success", "Exam Info Updated Successfully")

                }
                // navigate(`/exam/${newExamInfo.examTitle.replaceAll(" ", "-")}`)
            }else{
                triggerAlert("error", "Failed to Update Exam Info")
            }
        })
        .catch(() => {
            triggerAlert("error", "Failed to Update Exam Info")
        })
    }


    return (
        <main className="center flex-col w-full my-[15vh]">
            <section className="flex flex-col gap-4 w-11/12 lg:gap-8">
                {/* {examTitle} : {faculty} : {level} : {department}  */}
                <div className="flex flex-col w-fullw justify-between gap-4 ">

                    {/* Exam Title */}
                    <div className="flex flex-wrap gap-5 justify-between lg:items-center">
                        <input 
                            className={TopLevelHeader + " w-full lg:w-10/12 outline-gray-300 px- 2 p-3 rounded-xl"} 
                            ref={titleRef}
                            value={newExamInfo.examTitle} 
                            readOnly={editPart !== "examTitle"}
                            onClick={() => {
                                setEditPart("examTitle")
                            }}
                            onChange={(e) => {
                                setNewExamInfo({
                                    ...newExamInfo,
                                    examTitle: e.target.value
                                })
                            }}
                        />
                        {
                            editPart == "examTitle" && newExamInfo.examTitle !== examTitle ?
                            
                            <button className={PrimaryButtonCLass + " h-fit"} onClick={() => {
                                setEditPart("")
                                updateExamInfo()
                            }}>Save</button>
                             :

                            <button className={SecondaryButtonCLass + " h-fit"} onClick={() => {
                                titleRef.current?.focus()
                                setEditPart("examTitle")
                            }}>Edit</button> 
                        }
                    </div>
                    
                    {/* Exam Info */}
                    
                    <div className="flex flex-col md:grid md:grid-cols-2 lg:grid-cols-3 w-full gap-4">
                        <InfoComponent 
                            title={"Faculty:"}
                            info={newExamInfo.faculty}
                            icon={
                                editPart == "faculty" ?
                                
                                <i className="bi bi-x text-2xl hover:scale-110" onClick={() =>{
                                setEditPart("")
                                }}>

                            </i>: 
                            <i className="bi bi-chevron-down text-lg hover:scale-110" onClick={() =>{
                                setEditPart("faculty")
                                }}>

                            </i>    
                        }>
                            <EditPartDropDownComponent 
                                data={
                                    availableDepartments.map(d => d.faculty)
                                }   
                                part="faculty"
                                setNewExamInfo={setNewExamInfo} 
                                setEditPart={setEditPart}
                                newExamInfoEditPart ={newExamInfo.faculty}
                                newExamInfo={newExamInfo}
                                editPart={editPart}
                            /> 
                            {/* {
                                editPart == "faculty" && 
                            }    */}
                        </InfoComponent>

                        <InfoComponent 
                            title={"Level:"}
                            info={newExamInfo.level}
                            icon={
                                editPart == "level" ?
                                
                                <i className="bi bi-x text-2xl hover:scale-110" onClick={() =>{
                                setEditPart("")
                                }}>

                            </i>: 
                            <i className="bi bi-chevron-down text-lg hover:scale-110" onClick={() =>{
                                setEditPart("level")
                                }}>

                            </i>    
                        }
                            >
                                <EditPartDropDownComponent 
                                    data={["100", "200", "300"]}
                                    part="level"
                                    setNewExamInfo={setNewExamInfo} 
                                    newExamInfoEditPart ={newExamInfo.level}
                                    setEditPart={setEditPart}
                                    newExamInfo={newExamInfo}
                                    editPart={editPart}
                                /> 
                        </InfoComponent>

                        <InfoComponent 
                            title={"Department:"}
                            info={newExamInfo.department}
                            icon={
                                editPart == "department" ?
                                <i className="bi bi-x text-2xl hover:scale-110" onClick={() =>{
                                setEditPart("")
                                }}>

                            </i>: 
                            <i className="bi bi-chevron-down text-lg hover:scale-110" onClick={() =>{
                                setEditPart("department")
                                }}>

                            </i>    
                        }
                            >
                                <EditPartDropDownComponent 
                                // get departments based on the selected faculty
                                    data={availableDepartments.filter((d, i) => 
                                        d.faculty == newExamInfo.faculty ?
                                        availableDepartments[i] :[]
                                        )[1].departments}
                                        
                                    part="department"
                                    setNewExamInfo={setNewExamInfo} 
                                    setEditPart={setEditPart}
                                    newExamInfoEditPart ={newExamInfo.department}
                                    newExamInfo={newExamInfo}
                                    editPart={editPart}
                                />
                        </InfoComponent>
                        <div className="w-full flex gap-3">

                            <InfoComponent
                                title={"Questions:"}
                                info={questions.length}
                            />
                            <InfoComponent
                                title={"Total Score:"}
                                info={totalScore}
                            />
                        </div>
                    </div>  

                </div>
                {/* Duration, inport questions, set live or active  */}

                <div className="flex flex-wrap items-center gap-5 justify-center w-full">
                    <ImportQuestions 
                        examKey ={examKey} 
                        setExamStatus={setExamStatus} />
                    {/* <p>Duration: </p> */}
                    
                    <div className="flex gap-5 items-center">

                        <button className={`${status == "Active" ? SuccessButtonClass : SecondaryButtonCLass } font-bold text-sm button w-fit `}
                        onClick={() => updateExamStatus(examKey, status)}>{status == "Active" ? "Live" : "Go Live"}</button>

                        <SetTimeComponent 
                            examKey={examKey}
                            duration={duration}
                        />
                    </div>
                    
                    

                </div>

                
            </section>
            

            {/* A list of all questions in an editable format*/}
            {/* {   
                questions.length > 0 &&
                <> */}
               { questions?.map((question, i) => (
                    <EditQuestion 
                        editQuestionInfo={question} 
                        UpdateTotalScore={UpdateTotalScore} 
                        key={question.id}
                        questionNo={i+1}
                        noOfQuestions={questions.length}
                        />
                ))}
                {/* </> */}
            {/* } */}

            {/* Component to add a new question */}
            <AddQuestionForm examKey={examKey}
            no={questions?.length + 1}/>

            {
                questions?.length < 1 ? <p style={{
                    paddingLeft: 5+'%'
                }}>No saved Question</p> :
                ''
            }

        </main>

    )
    
}


interface EditPartDropDownComponentInterface {
    data: string[],
    part: string,
    setNewExamInfo: (newExamInfo: newExamInfoInterface) => void,
    setEditPart: (editPart: string) => void,
    newExamInfo: newExamInfoInterface,
    editPart: string,
    newExamInfoEditPart: string
}


const EditPartDropDownComponent:FC<EditPartDropDownComponentInterface> = ({data, part, setNewExamInfo, setEditPart, newExamInfo, editPart, newExamInfoEditPart }) => {
    const newData = [...data, "All"]
    
    if(editPart == part){
          return(
            <div className="absolute top-[100%] mt-2 left-0 w-full flex flex-col bg-gray-100 shadow-xl rounded-xl overflow-hidden z-20">
                {
                    newData.map((d, key)  => (
                        <p key={key}
                         className={`hover:bg-white p-3 px-5 transition-all duration-500 ease-in-out text-sm
                        ${newExamInfoEditPart== d ? "bg-white" : ""}
                        `}
                        onClick={() => {
                            setEditPart("")
                            setNewExamInfo({
                                ...newExamInfo,
                                [part]: d
                            })
                        }}
                        >
                            {d}
                        </p>
                    ))
                }
            </div>
          )   

    }
}