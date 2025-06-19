import { useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import Cookie from "js-cookie"
import {  PrimaryButtonCLass, TopLevelHeader } from "../../../assets/Constants"
import { useDispatch, useSelector } from "react-redux"
import { ExamCard } from "../../../Components/ExamCard"
import { AppDispatch, RootState } from "../../../assets/store/AppStore"
import { FetchExams } from "../../../assets/store/AllExamsSlice"
import { Loader } from "../../../Components/Loader"
 

export const AllExams = () =>{
    const Navigate = useNavigate()
    const dispatch = useDispatch<AppDispatch>()
    const { exams, loading } = useSelector((state: RootState) => state.allexamsslice)
    
    const CookiedUserDetails = Cookie.get("userDetails") 
    
    useEffect(() =>{
        document.documentElement.scrollTop=0
        if(CookiedUserDetails !== "admin"){
            Navigate("/")
        }
        else{
            dispatch(FetchExams())
            Cookie.remove('examDetails', {path:'/admin'})
        }
    }, [])
    

    return (
        <main className='center flex-col w-full my-[12vh]'> 
  
            <div className="center w-11/12 flex-col">

                <div className="w-full flex flex-col lg:flex-row justify-between lg:items-center gap-3">
                    <h1 className={TopLevelHeader}>Exams</h1>

                    <div className="flex items-center gap-3 w-full lg:w-fit">
                        <Link to={'/exams/add-new'} className={PrimaryButtonCLass + " "}> Add New Exam</Link>

                        {/* <Link to="" className={SecondaryButtonCLass + " "}>View Reports</Link> */}
                    </div>
                </div>

                {exams.length == 0 ?
                    loading ?
                    <div className="min-h-[40vh] center w-full"><Loader /> </div> 
                    :
                    <div className="h-[70vh] center flex-col gap-2">
                        <i className="bi bi-file-text text-5xl"></i>
                        <p>No exams added</p>
                        <Link to={'/exams/add-new'} className={PrimaryButtonCLass + "flex items-center gap-1 scale-75"}> <i className="bi bi-plus text-2xl"></i>
                                Add New Exam
                        </Link>

                    </div>
                    : 
                    <section className="w-full mt-[7vh] gap-5 grid grid-cols-1 lg:grid-cols-2">
                        {exams?.map((exam) =>(                        
                            <ExamCard 
                                exam={exam} 
                                key={exam.id}
                            />
                        ))}
                    </section>
                }
            </div>
        </main>
    )
}