import { useEffect, useState } from "react"
import { useParams, Link, useLocation } from "react-router-dom"
import useProyectos from "../hooks/useProyectos"
import useAdmin from "../hooks/useAdmin"
import Alerta from "../components/Alerta"
import ModalFormularioTarea from "../components/ModalFormularioTarea"
import ModalEliminarTarea from "../components/ModalEliminarTarea"
import ModalEliminarColaborador from "../components/ModalEliminarColaborador"
import Tarea from "../components/Tarea"
import Colaborador from "../components/Colaborador"
import io from "socket.io-client"

let socket;

const Proyecto = () => {

    const {id} = useParams()
    const location = useLocation()
    const { obtenerProyecto, proyecto, cargando, alerta, handleModalCrearTarea, loadTareas } = useProyectos()
    const admin = useAdmin()
    const { nombre, cliente, descripcion } = proyecto

    useEffect(() =>{
        obtenerProyecto(id)
    }, [id])

    useEffect(() =>{
        const abrirSocket = async () =>{
            socket = io(import.meta.env.VITE_BACKEND_URL)
            socket.emit("abrir-proyecto", id)
        }
        abrirSocket()
        console.log(id)
    }, [])

    useEffect(() =>{
        socket.on("tarea-agregada", (tareaNueva) => {
            if(tareaNueva.proyecto == proyecto._id && tareaNueva.proyecto == id){
                loadTareas("agregar", tareaNueva)
            }
        })
    })
    useEffect(() =>{
        socket.on("tarea-eliminada", (tareaEliminada) => {
            if(tareaEliminada.proyecto == proyecto._id && tareaEliminada.proyecto == id){
                loadTareas("eliminar", tareaEliminada)
            }
        })
    })
    useEffect(() =>{
        socket.on("tarea-editada", (tareaEditada) => {
            if(tareaEditada.proyecto._id == proyecto._id && tareaEditada.proyecto._id == id){
                loadTareas("editar", tareaEditada)
            }
        })
    })
    useEffect(() =>{
        socket.on("tarea-completada", (tareaCompletada) => {
            if(tareaCompletada.proyecto._id == proyecto._id && tareaCompletada.proyecto._id == id){
                loadTareas("completar", tareaCompletada)
            }
        })
    })

    if(cargando) return "cargando..."
    return (
        <>
            <div className="mb-4 text-gray-500 text-lg cursor-default">
                <Link className="hover:text-black transition-colors" to="/proyectos">Proyectos</Link> / <span className="text-sky-700 font-medium">{nombre}</span> 
            </div>

            <div className="flex justify-between items-center">
                <h1 className="text-4xl font-black">{nombre}</h1>

                {admin && (alerta.error ? '' : (
                    <Link to={`/proyectos/editar/${id}`} className="flex items-center gap-2 text-gray-400 hover:text-black transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
                        </svg>

                        <span className="uppercase font-bold">Editar</span>
                    </Link>
                ))}

            </div>

            {admin && (<button onClick={handleModalCrearTarea} type="button" className="text-md px-5 py-3 w-auto rounded-lg uppercase font-bold bg-sky-400 hover:bg-sky-500 transition-colors text-sm text-white text-center mt-5 flex gap-2 items-center">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                    <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25ZM12.75 9a.75.75 0 0 0-1.5 0v2.25H9a.75.75 0 0 0 0 1.5h2.25V15a.75.75 0 0 0 1.5 0v-2.25H15a.75.75 0 0 0 0-1.5h-2.25V9Z" clipRule="evenodd" />
                </svg>

                Nueva Tarea
            </button>)}

            <p className="font-bold text-xl mt-10">Tareas del Proyecto</p>

            <div className="bg-white shadow rounded-lg mt-10">
                {proyecto.tareas?.length ? (
                    proyecto.tareas?.map(tarea => (
                        <Tarea key={tarea._id} tarea={tarea}/>
                    ))
                ) : (
                    
                    <p className="text-center my-5 p-10">No Hay Tareas En Este Proyecto</p>
                )}
            </div>

            {admin && (
                <>
                    <div className="flex justify-between items-center mt-12">
                        <p className="font-bold text-xl">Colaboradores</p>

                        {alerta.error ? '' : (
                            <Link to={`/proyectos/agregar-colaborador/${id}`} className="flex items-center gap-2 text-gray-400 hover:text-black transition-colors">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M18 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM3 19.235v-.11a6.375 6.375 0 0 1 12.75 0v.109A12.318 12.318 0 0 1 9.374 21c-2.331 0-4.512-.645-6.374-1.766Z" />
                                </svg>


                                <span className="uppercase font-bold">Añadir</span>
                            </Link>
                        )}

                    </div>

                    <div className="bg-white shadow rounded-lg mt-10">
                        {proyecto.colaboradores?.length ? (
                            proyecto.colaboradores?.map(colaborador => (
                                <Colaborador key={colaborador?._id} colaborador={colaborador}/>
                            ))
                        ) : (
                            
                            <p className="text-center my-5 p-10">Aún No Hay Colaboradores En Tu Proyecto.</p>
                        )}
                    </div>
                </>
            )}

            <ModalFormularioTarea/>
            <ModalEliminarTarea/>
            <ModalEliminarColaborador/>
        </>
    )
}

export default Proyecto