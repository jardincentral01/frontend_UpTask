import formatearFecha from "../helpers/formatearFecha"
import useProyectos from "../hooks/useProyectos"
import useAuth from "../hooks/useAuth"
import useAdmin from "../hooks/useAdmin"
import { useState } from "react"

const Tarea = ({tarea}) => {

    const [ spinner, setSpinner ] = useState(false)
    const { handleModalEditarTarea, handleModalEliminarTarea, completarTarea } = useProyectos()
    const { auth } = useAuth()
    const admin = useAdmin()

    const { _id, nombre, descripcion, fechaEntrega, prioridad, estado, completado} = tarea

    const handleCompletar = async () =>{
        if(completado != null &&  auth._id != completado._id) return
        setSpinner(true)
        await completarTarea(_id)
        setSpinner(false)
    }

    return (
        <div className="border-b flex justify-between items-center px-3 md:px-5 py-5">
            <div>
                <p className="text-lg md:text-xl mb-1">{nombre}</p>
                <p className="text-xs md:text-sm text-gray-500 uppercase mb-1">{descripcion}</p>
                <p className="text-lg md:text-xl mb-1">{formatearFecha(fechaEntrega)}</p>
                <p className="text-gray-600 mb-1">Prioridad: {prioridad}</p>
                {estado && <p className="text-xs inline bg-green-600 uppercase px-2 py-1 rounded-lg text-white font-bold">Completada por: {completado.nombre}</p>}
            </div>

            <div className="flex flex-col lg:flex-row gap-2">
                {admin && (<button onClick={() => handleModalEditarTarea(tarea)} className="bg-indigo-600 hover:bg-indigo-700 transition-colors px-4 py-3 text-white uppercase font-bold text-sm rounded-lg">Editar</button>)}

                <button className={`${estado ? "bg-sky-600 hover:bg-sky-700" : "bg-gray-600 hover:bg-gray-700"} transition-colors px-4 py-3 text-white uppercase font-bold text-sm rounded-lg relative`} onClick={handleCompletar} disabled={`${spinner ? "disabled" : ""}`}>
                    {spinner && (
                        <>
                            <div className="absolute top-0 start-0 w-full h-full bg-white/[.6] z-50 rounded-lg"></div>

                            <div className="absolute top-1/2 start-1/2 transform -translate-x-1/2 -translate-y-1/2">
                                <div className="animate-spin inline-block w-5 h-5 border-[5px] border-current border-t-transparent text-sky-600 rounded-full dark:text-sky-500" role="status" aria-label="loading">
                                <span className="sr-only">Loading...</span>
                                </div>
                            </div>
                        </>
                    )}
                    {estado ? "Completa" : "Incompleta"}
                </button>

                {admin && (<button onClick={() => handleModalEliminarTarea(tarea)} className="bg-red-600 hover:bg-red-700 transition-colors px-4 py-3 text-white uppercase font-bold text-sm rounded-lg">Eliminar</button>)}
            </div>
        </div>
    )
}

export default Tarea