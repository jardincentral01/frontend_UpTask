import { useParams, Link } from "react-router-dom"
import Alerta from "../components/Alerta"
import { useEffect, useState } from "react"
import axios from "axios"
import clienteAxios from "../config/clienteAxios"

const NuevoPassword = () => {
    const [alerta, setAlerta] = useState({})
    const [password, setPassword] = useState("")
    const [tokenValido, setTokenValido] = useState(false)
    const [passwordModificado, setPasswordModificado] = useState(false)
    const { token } = useParams()

    useEffect(() =>{
        const comprobarToken = async () =>{
            try {
                await clienteAxios(`/usuarios/olvide-password/${token}`)
                setTokenValido(true)       
            }catch (error) {
                console.log(error)
                setAlerta(error.response.data)
            }
        }
        comprobarToken()
    }, [])

    const handleSubmit = async (e) =>{
        e.preventDefault()
        if(!password){
            return setAlerta({msg: "Introduce Tu Nuevo Password.", error: true})
        }
        if(password.length <= 5){
            return setAlerta({msg: "Tu Password Es Muy Corto. Mínimo 6 Caractéres.", error: true})
        }
        setAlerta({})
        try {
            const { data } = await clienteAxios.post(`/usuarios/olvide-password/${token}`, {
                password
            })
            setAlerta(data)
            setTokenValido(false)
            setPasswordModificado(true)
            setPassword("")
        } catch (error) {
            setAlerta(error.reponse.data)
        }
    }

    return (
        <>
            <h1 className=" text-sky-700 font-black text-6xl capitalize">Crea tu Nueva contraseña y accede a tus <span className="text-slate-700">Proyectos</span></h1>

            {alerta.msg && <Alerta alerta={alerta}/>}

            {tokenValido && (
                <form onSubmit={handleSubmit} className="my-10 bg-white shadow rounded-lg p-10">

                    <div className="my-5">
                        <label className="uppercase text-gray-600 block text-xl font-bold" htmlFor="password">Nueva Contraseña</label>
                        <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" id="password" placeholder="Escribe Tu Nueva Contraseña" className="w-full mt-3 p-3 border rounded-xl bg-gray-50 focus:outline outline-sky-700" />
                    </div>

                    <input type="submit" value="Guardar Nueva Contraseña" className="w-full p-3 bg-sky-700 my-5 text-white uppercase font-bold rounded-md hover:cursor-pointer hover:bg-sky-800 transition-colors"/>
                </form>

            )}

            {passwordModificado && (
                <Link className="block text-center my-5 text-slate-500" to="/">
                    Iniciar Sesión
                </Link>
            )}
        </>
    )
}

export default NuevoPassword