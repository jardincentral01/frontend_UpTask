import { Link } from "react-router-dom"
import useProyectos from "../hooks/useProyectos"
import useAuth from "../hooks/useAuth"
import Buscador from "./Buscador"

const Header = () => {

    const { handleBuscador, cerrarSesionProyectos } = useProyectos()
    const { cerrarSesionAuth } = useAuth()

    const handleCerrarSesion = () =>{
        cerrarSesionAuth()
        cerrarSesionProyectos()
        localStorage.removeItem("token")
    }
    return (
        <header className="px-4 py-5 bg.white border-b bg-white">
            <div className="md:flex md:justify-between md:items-center">
                <h2 className="text-4xl text-center text-sky-600 font-black mb-5">UpTask</h2>

                <div className="flex gap-4 items-center flex-col md:flex-row">
                    <button onClick={handleBuscador} to={"/proyectos"} className="font-bold uppercase">Buscar Proyectos...</button> 
                    <Link to={"/proyectos"} className="font-bold uppercase">Proyectos</Link> 
                    <button onClick={handleCerrarSesion} className="text-white text-sm bg-rose-500 hover:bg-rose-600 transition-colors p-3 rounded-md uppercase font-bold" type="button">Cerrar Sesión</button>

                    <Buscador/>
                </div>
            </div>
        </header>
    )
}

export default Header