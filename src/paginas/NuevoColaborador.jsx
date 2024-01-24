import Alerta from "../components/Alerta"
import useProyectos from "../hooks/useProyectos"
import FormularioColaborador from "../components/FormularioColaborador"
import { Link, useParams } from "react-router-dom"
import { useEffect } from "react"

const NuevoColaborador = () => {

    const params = useParams()
    const { alerta, proyecto, obtenerProyecto, cargando, colaborador, spinner, agregarColaborador } = useProyectos()
    const { _id, nombre } = proyecto

    useEffect(() =>{
        obtenerProyecto(params.id)
    }, [])

    if(cargando) return "cargando..."

    return (
        <>
            <div className="mb-4 text-gray-500 text-lg cursor-default">
                <Link className="hover:text-black transition-colors" to="/proyectos">Proyectos</Link> / <Link className="hover:text-black transition-colors" to={`/proyectos/${_id}`}>{nombre}</Link> / <span className="text-sky-700 font-medium">Agregar Colaborador</span>
            </div>

            <h1 className="text-4xl font-black">Agregar Colaborador(a)</h1>

            {alerta.msg && <div className="w-3/4 md:w-2/3 mx-auto text-sm md:text-base"><Alerta alerta={alerta}/></div>}

            <div className="mt-10 w-11/12 md:w-9/12 lg:w-1/2 mx-auto">
                <FormularioColaborador/>
            </div>
            
            {!spinner && (colaborador?._id && (
                <div className="w-11/12 md:w-9/12 lg:w-1/2 mx-auto mt-10">
                    <div className="bg-white py-10 px-5 rounded-lg shadow">
                        <h2 className="font-bold text-2xl mb-10 text-center">Resultado: </h2>

                        <div className="flex justify-between items-center">
                            <p>{colaborador.nombre}</p>

                            <button onClick={() => agregarColaborador({email: colaborador.email})} type="button" className="bg-slate-500 py-2 px-5 rounded-lg uppercase text-white text-sm font-bold">
                                Agregar Al Proyecto
                            </button>
                        </div>
                    </div>
                </div>
            ))}
        </>
    )
}

export default NuevoColaborador