import { useEffect } from "react"
import Cookie from "js-cookie"
import { Link, useNavigate } from "react-router-dom"
import { TopLevelHeader } from "../../assets/Constants"

export const Home = () =>{
    const Navigate = useNavigate()

    useEffect(() => {
        // setLogin(false)
        Navigate('/')
        Cookie.remove('userDetails', {path:'/'})
    }, [])

    const LinkClass = "center bg-gray-100 w-[250px] lg:w-[300px] h-[100px] md:h-[150px] rounded-xl shadow-lg hover:bg-gray-800 hover:text-gray-100 transition-all duration-1000 z-10"
    return (
        <section className="w-full center min-h-[110vh] lg:min-h-screen">
            <div className="w-11/12 center flex-col gap-4 lg:gap-10 lg:mt-6">
                <h1 className={TopLevelHeader + " text-5xl lg:text-6xl"}>
                    Exam App
                </h1>

                <div className="center flex-col gap-4 text-xl lg:text-2xl">
                    <p>Select an Account</p>

                    <div className="center flex-col lg:flex-row gap-2 lg:gap-9">
                        <Link to='/Student_login' className={LinkClass}> 
                            Student 
                        </Link>

                        <img src="./images (1).jpeg" alt="Educational Image" className="w-6/12"/>

                        {/* <Link to='/dashboard' className={LinkClass}>  */}
                        <Link to='/Login' className={LinkClass}> 
                            Admin 
                        </Link>
                    </div>
                </div>

            </div>
        </section>
    )
}