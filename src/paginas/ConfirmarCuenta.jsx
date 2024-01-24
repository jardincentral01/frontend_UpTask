import { useParams, Link } from "react-router-dom"
import { useEffect, useState } from "react"
import clienteAxios from "../config/clienteAxios"
import Alerta from "../components/Alerta"

const ConfirmarCuenta = () => {
    const { id } = useParams()
    const [alerta, setAlerta] = useState({})
    const [cuentaConfirmada, setCuentaConfirmada] = useState(false)
    useEffect(() =>{
        const handleConfirmar = async () =>{
            try {
                const { data } = await cliente(`/usuarios/confirmar/${id}`)
                setAlerta(data)
                setCuentaConfirmada(true)
            } catch (error) {
                setAlerta(error.response.data)
            }
            
        }
        handleConfirmar()
    }, [])

    return (
        <>
            <h1 className=" text-sky-600 font-black text-6xl capitalize">Confirma Tu Cuenta y Empieza tus <span className="text-slate-700">Proyectos</span></h1>

            <div className="mt-20 md:mt-10">
                {alerta.msg && <Alerta alerta={alerta}/>}

                {cuentaConfirmada && (
                    <Link className="block text-center my-5 text-slate-500" to="/">
                        Iniciar Sesión
                    </Link>
                )}
            </div>
            
        </>
    )
}

export default ConfirmarCuenta