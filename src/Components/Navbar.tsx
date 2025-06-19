import Cookie from "js-cookie"
import { FC, useEffect, useState } from "react"
import { PrimaryButtonCLass, SecondaryButtonCLass } from "../assets/Constants"
import { useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { setCurrentNav, setShowSideNav, setShowTopNav } from "../assets/store/NavigationSlice"
import { useLogout } from "../assets/Hooks/useLogout"
import { useMyConfirmBox } from "../assets/Hooks/useMyConfirmBox"
import { setConfirmedAction } from "../assets/store/ConfirmBoxSlice"
import { AppDispatch, RootState } from "../assets/store/AppStore"

export const Navbar = () =>{
    const [ showUserDropDown, setShowUserDropDown ] = useState(false)
    const navigate = useNavigate()
    const dispatch = useDispatch<AppDispatch>()
    const { currentNav, showSideNav, showTopNav} = useSelector((state:RootState) => state.navigation)  
    const studentslice = useSelector((state:RootState) => state.studentslice)  

    // const currentDropDown = navigation.currentDropDown
    
    useEffect(() => {
        const user = Cookie.get("userDetails")
        if(user == "admin"){
            dispatch(setShowTopNav(true))
        }
    }, [showTopNav])


    const SideNav =  Cookie.get("userDetails") == "admin" ? 
    [
        {
            title: 'Dashboard',
            link: 'dashboard',
            icon: 'grid-fill',
        },
        {   
            title: 'All Exams',
            link: 'exams/all-exams',
            icon: 'book-fill'
        },
        {
            title: 'Add New Exam',
            link: 'exams/add-new',
            icon: 'plus scale-[1.5]'
    
        },
        // {
        //     title: 'Reports',
        //     // all exams title, level, department, faculty, number of submits, high, lowest
        //     link: 'reports',
        //     icon: 'bar-chart-line-fill',
           
        // },
        // {
        //     title: 'Settings',
        //     link: '#',
        //     icon: 'gear-fill',
        // },
        
        
    ] : 
    [
        {
            title: 'Home',
            link: `student/${studentslice.firstName.toLowerCase()}-${studentslice.lastName.toLowerCase()}`,
            icon: 'grid-fill',
        },
        {
            title: 'Reports',
            // all exams title, level, department, faculty, number of submits, high, lowest
            link: 'student/reports',
            icon: 'bar-chart-line-fill',
           
        },
        {
            title: 'Settings',
            link: 'settings',
            icon: 'gear-fill',
        },
    ]


    return(
        <>
        {/* *******************  SIDE BAR NAVIGATION    ******************* */}

            <div className={`fixed top-0 z-40 h-screen w-full flex justify-start items-start  transition-all duration-1000 ${showSideNav ? "" : '-translate-x-[100%]'}`}>
                <nav className="flex flex-col bg-gray-100 items-center w-[100%] lg:w-[40%] xl:w-[25%] h-screen pt-[10vh]">
                    {
                        SideNav.map((nav, i) => (
                            <div key={i} className="flex flex-col transition-all duration-1000 justify-between w-full text-s  text-gray-900 border-b border-gray-200 ">
                                <div className={`flex w-full p-5 justify-between cursor-pointer ${currentNav === i ? 'bg-primary text-white hover:bg-blue-900' : 'text-secondary hover:bg-gray-200'}`} onClick={() => {
                                    navigate(`/${nav.link}`)
                                    dispatch(setCurrentNav(i))
                                    dispatch(setShowSideNav(false))
                                }}>
                                    <div className="flex gap-5 ">
                                        <i className={`bi bi-${nav.icon} `}></i>
                                        <p>{nav.title}</p>
                                    </div>

                                </div>
                            </div>
                        ))
                    }
                </nav>

                <div className="h-full bg-transparent w-[60%] lg:w-[60%] xl:w-[70%]" onClick={ ()=> dispatch(setShowSideNav(!showSideNav))}>
                
                </div>

            </div>

        
        {/********************  TOP NAVIGATION    ********************/}
        
        <div className={`fixed h-[8vh] md:h-[10vh] shadow bg-gray-900 top-0 w-full flex items-center justify-between z-[45]
        ${showTopNav ? "" : "translate-y-[-20vh]"}
        `}>
            {/* LEFT TOP NAV */}
            <div className="w-11/12 flex items-center gap-6 px-5">
                <i className={` bi bi-${!showSideNav ? 'list' : 'x-lg'} bg-gray-100 text-2xl cursor-pointer text-gray-900 center h-8 w-12 rounded center`} onClick={ ()=> {
                    dispatch(setShowSideNav(!showSideNav))
                    setShowUserDropDown(false)
                    }}></i>
            </div>
          

            {/* RIGHT TOP NAV */}
            <div className="flex justify-end items-center px-5 text-gray-100 w-7/12 bg-yellow-30 0 gap-4 md:gap-6">

                <div className="flex relative cursor-pointer">
                    <i className={`bi bi-${showUserDropDown ? "x text-3xl" : "person-fill text-xl md:text-2xl"} border bg-gray-100 text-secondary rounded-full h-8 w-8 md:h-10 md:w-10 center `}
                    onClick={() => {
                        setShowUserDropDown(!showUserDropDown)
                        dispatch(setShowSideNav(false))
                    }}></i>


                </div>

            </div>

        </div>
        {
            showTopNav &&
            <UserDropDown 
                showUserDropDown={showUserDropDown} 
                setShowUserDropDown={setShowUserDropDown}
            />
        }
        
        </>
    )
}


interface UserDropDownInterface {
    showUserDropDown: boolean,
    setShowUserDropDown: (showUserDropDown: boolean) => void
}

const UserDropDown:FC<UserDropDownInterface> = ({showUserDropDown, setShowUserDropDown}) => {
    const [ userName, setUserName ] = useState("")
    const [ goTo, setGoto ] = useState("")
    const [ logoutClicked, setLogoutClicked ] = useState(false)
    const cookiedUserDetails = Cookie.get("userDetails")
    const Logout = useLogout()
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const useConfirmBox = useMyConfirmBox()
    const confirmedAction = useSelector((state: RootState) => state.confirmBox.confirmedAction)  


    useEffect(() => {
        if(cookiedUserDetails != undefined) {
            if(cookiedUserDetails == "admin"){
                setUserName(cookiedUserDetails)
                setGoto("login")
            }else{
                const studentDetails = JSON.parse(cookiedUserDetails)
                setUserName(`${studentDetails.firstName} ${studentDetails.lastName}`)
                setGoto("student_login")
            }
        }
    }, [])

    useEffect(() => {
        if(confirmedAction && logoutClicked){    
            // console.log("Log Out")
            setShowUserDropDown(false)
            Logout(goTo)
            navigate(`/${goTo}`)
            dispatch(setConfirmedAction(false))
        }
    }, [confirmedAction])


    return(
        <div className={` ${showUserDropDown ? "" : "translate-y-[-200%]"} fixed transition-all duration-1000 ease-in-outout bg-gray-100 min-w-[200px] flex justify-start items-center flex-col top-[7vh] right-5 min-h-[30vh] rounded-xl shadow-xl shadow-gray-300 text-gray-900 p-5 gap-4 z-[10]`}>

            <div className="capitalize w-full flex items-end mb-2">

                <i className="bi bi-person-fill bg-white shadow text-secondary rounded-full h-8 w-8 md:h-10 md:w-10 center text-xl md:text-2xl"></i>
                <p className="text-[12px]">
                    {userName}
                </p>
            </div>

            <div id={"/settings"} className={`${SecondaryButtonCLass} w-full center hover:border-b hover:border-blue-900`}
            onClick={() => 
                setShowUserDropDown(false)
            }>
                Settings
            </div>

            <button className={`${PrimaryButtonCLass} w-full`} 
            onClick={() => {
                setLogoutClicked(true)
                useConfirmBox("Do you want to logout", "")
            }}>
                Logout
            </button>
        </div>
    )
}