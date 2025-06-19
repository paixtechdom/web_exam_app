import { createBrowserRouter, RouterProvider, Outlet, useNavigate } from 'react-router-dom';

import { createContext, useState, useEffect, Context } from 'react';
import Cookie from 'js-cookie'
import axios from 'axios';
// import { Settings } from './Component/Settings/Settings';
import { Navbar } from './Components/Navbar';
import { Home } from './Pages/Home/Home';
import { CreateExam } from './Pages/Admin/Pages/CreateExams/CreateExam';
import { Examination } from './Pages/Student/Examination/Examination';
import { StudentLogin } from './Pages/Student/StudentLogin';
import { StudentRegistration } from './Pages/Student/StudentRegistration';
import { Student } from './Pages/Student/Student';
import { Admin } from './Pages/Admin/Admin';
import { AddNewExam } from './Pages/Admin/Pages/AddNewExam';
import { AllExams } from './Pages/Admin/Pages/AllExams';
import { Login } from './Pages/Admin/Pages/Login';
import { PageNotFound } from './Pages/PageNotFound';
import Alert from './Components/Alert';
import { ExamReport } from './Pages/Admin/Pages/ExamReport/ExamReport';
import { dbLocation } from './assets/Constants';
import { StudentReports } from './Pages/Student/Reports/StudentReports';
import { ConfirmBox } from './Components/ConfirmBox';

const value={}
export const AppContext = createContext(value)

const Layout = () =>{
  
  const [ examQuestions, setExamQuestions ] = useState([])
  const [ savedQuestions, setSavedQuestions ] = useState([])    
  const [ exams, setExams ] = useState([])


  useEffect(() => {
    document.documentElement.scrollTop = 0
  }, [document.URL])


const fetchExams = () =>{
  axios.get(`${dbLocation}/exams.php/`).then(function(response){
      setExams(response.data)
  }) 
}

const fetchQuestions = (newExamKey: string) =>{
  axios.get(`${dbLocation}/examquestions.php/${newExamKey}`)
  .then(function(response){
      // console.table(response.data)
      setSavedQuestions(response.data)
    }) 
  }
  


  return(
    <div className='app z-1'>
   
        
        <AppContext.Provider value={{ savedQuestions, setSavedQuestions, examQuestions, setExamQuestions, fetchExams, exams, setExams, fetchQuestions }}>
          {
            Cookie.get('userDetails') !== undefined &&
            <Navbar />
          }
        <Alert />
        <Outlet />
        <ConfirmBox />

      </AppContext.Provider> 

 
    </div>
  )
}

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children:[
      {
        path: '/',
        element: <Home />
      },
      {
        path: '/dashboard',
        element: <Admin />
      },

      // Edit and update exam information and questions
      {
        path: '/exam/:examTitle',
        element: <CreateExam />
      },

      // Create new exam, setting the title, dept, level and faculty
      {
        path: '/exams/add-new',
        element: <AddNewExam />
      },

      // to view all exams from the admin panel
      {
        path: '/exams/all-exams',
        element: <AllExams />
      },

      // to view reports for exams
      {
        path: '/exams/report/:examTitle',
        element: <ExamReport />
      },
      // admin login page
      {
        path: '/Login',
        element: <Login />
      },
      // student login
      {
        path: '/Student_login',
        element: <StudentLogin />
      },
      // student home page
      {
        path: '/student/:username',
        element: <Student />
      },
      {
        path: '/student/reports',
        element: <StudentReports />
      },
      // exam interface
      {
        path: '/examination/:examinationKey',
        element: <Examination />
      },
      
      {
        path: '/Student_registration',
        element: <StudentRegistration />
      },
      {
        path: '/*',
        element: <PageNotFound />
      }
    ]
  }
])

function App() {
  
    return (
      <div className='App'>

          <RouterProvider router={router} /> 
      
      </div>
    )



}
export default App;
         