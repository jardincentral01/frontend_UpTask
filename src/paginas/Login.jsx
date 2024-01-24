import { Link, useNavigate } from "react-router-dom"
import { useState } from "react"
import clienteAxios from "../config/clienteAxios"
import Alerta from "../components/Alerta"
import validarEmail from "../helpers/validarEmail"
import useAuth from "../hooks/useAuth"

const Login = () => {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [alerta, setAlerta] = useState({})

    const {setAuth} = useAuth()

    const navigate = useNavigate()

    const handleSubmit = async (e) =>{
        e.preventDefault()
        if([email, password].includes("") || (!validarEmail(email) && password.length <= 5)){
            return setAlerta({msg: "El Email Y La Contraseña Son Obligatorios.", error:true})
        }
        if(!validarEmail(email)){
            return setAlerta({msg: "Introduce Un Email Válido.", error:true})
        }
        if(password.length <= 5){
            return setAlerta({msg: "Tu Password Es Muy Corto. Mínimo 6 Caractéres.", error:true})
        }
        try {
            const { data } = await clienteAxios.post("/usuarios/login", {email, password})
            setAlerta({})
            localStorage.setItem("token", data.token)
            setAuth(data)
            navigate("/proyectos")
        } catch (error) {
            setAlerta(error.response.data)
        }
    }
    return (
        <>
            <h1 className="text-sky-600 font-black text-6xl capitalize">Inicia Sesión y Administra tus <span className="text-slate-700">Proyectos</span></h1>

            {alerta.msg && <Alerta alerta={alerta}/>}

            <form onSubmit={handleSubmit} className="my-10 bg-white shadow rounded-lg p-10">
                <div className="my-5">
                    <label className="uppercase text-gray-600 block text-xl font-bold" htmlFor="email">Email</label>
                    <input value={email} onChange={(e) => setEmail(e.target.value)} type="text" id="email" placeholder="Email de Registro" className={`w-full mt-3 p-3 border rounded-xl bg-gray-50 focus:outline outline-sky-600`} />
                </div>

                <div className="my-5">
                    <label className="uppercase text-gray-600 block text-xl font-bold" htmlFor="password">Contraseña</label>
                    <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" id="password" placeholder="Tu Contraseña" className={`w-full mt-3 p-3 border rounded-xl bg-gray-50 focus:outline outline-sky-600`} />
                </div>

                <input type="submit" value="Iniciar Sesión" className="w-full p-3 bg-sky-600 my-5 text-white uppercase font-bold rounded-md hover:cursor-pointer hover:bg-sky-800 transition-colors"/>
            </form>

            <nav className="lg:flex lg:justify-between">
                <Link className="block text-center my-5 text-slate-500" to="/registrar">
                    ¿No tienes una cuenta? Regístrate
                </Link>

                <Link className="block text-center my-5 text-slate-500" to="/olvide-password">
                    Olvidé Mi Contraseña
                </Link>
            </nav>
        </>
    )
}

export default Login