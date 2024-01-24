import { Link } from "react-router-dom"
import Alerta from "../components/Alerta"
import { useState } from "react"
import clienteAxios from "../config/clienteAxios"

const OlvidePassword = () => {
    const [alerta, setAlerta] = useState({})
    const [email, setEmail] = useState("")

    const handleSubmit = async (e) =>{
        e.preventDefault()
        if(!email || !email.includes('@') || email.length < 4){
            setAlerta({
                msg: "Introduce Un Email Válido.",
                error: true
            })
            return
        }

        try {
            const {data} = await clienteAxios.post(`/usuarios/olvide-password`,{
                email
            })
            setAlerta(data)
            setEmail("")
        } catch (error) {
            setAlerta(error.response.data)
        }
    }
    return (
        <>
            <h1 className=" text-sky-600 font-black text-6xl capitalize">Recupera tu Acceso y No Pierdas tus <span className="text-slate-700">Proyectos</span></h1>

            {alerta.msg && <Alerta alerta={alerta}/>}

            <form onSubmit={handleSubmit} className="my-10 bg-white shadow rounded-lg p-10">

                <div className="my-5">
                    <label className="uppercase text-gray-600 block text-xl font-bold" htmlFor="email">Email</label>
                    <input value={email} onChange={(e) => setEmail(e.target.value)} type="text" id="email" placeholder="Email de Registro" className="w-full mt-3 p-3 border rounded-xl bg-gray-50 focus:outline outline-sky-600" />
                </div>

                <input type="submit" value="Enviar Instrucciones" className="w-full p-3 bg-sky-600 my-5 text-white uppercase font-bold rounded-md hover:cursor-pointer hover:bg-sky-800 transition-colors"/>
            </form>

            <nav className="lg:flex lg:justify-between">
                <Link className="block text-center my-5 text-slate-500" to="/">
                    ¿Ya Tienes una Cuenta? Inicia Sesión
                </Link>

                <Link className="block text-center my-5 text-slate-500" to="/registrar">
                ¿No tienes una cuenta? Regístrate
                </Link>
            </nav>
        </>
    )
}

export default OlvidePassword