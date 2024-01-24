import { Navigate, Outlet } from "react-router-dom"
import useAuth from "../hooks/useAuth"

const AuthLayout = () => {

    const { auth, isLoading } = useAuth()
    
    if(isLoading) return "Cargando..."
    return (
        <>
            {auth._id ? <Navigate to={"/proyectos"}/> : (
                <main className="container mx-auto mt-5 md:mt-20 p-5 md:flex md:justify-center">
                <div className="md:w-2/3 lg:w-1/2">
                    <Outlet/>
                </div>
                </main>
            )}
            
        </>
    )
}

export default AuthLayout