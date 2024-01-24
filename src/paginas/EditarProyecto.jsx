import { useEffect } from "react"
import { Link, useParams } from "react-router-dom"
import useProyectos from "../hooks/useProyectos"
import FormularioProyecto from "../components/FormularioProyecto"
import Alerta from "../components/Alerta"
import Swal from "sweetalert2"

const EditarProyecto = () => {

    const {id} = useParams()
    const { alerta, obtenerProyecto, proyecto, cargando, eliminarProyecto } = useProyectos()
    const { _id, nombre, cliente, descripcion } = proyecto

    useEffect(() =>{
        obtenerProyecto(id)
    }, [id])

    const handleClick = () =>{
        Swal.fire({
            title: "¿Eliminar Proyecto?",
            text: "¡No podrás revertir esta acción!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Sí, ¡eliminar!",
            cancelButtonText: "Cancelar"
        }).then((result) => {
                if (result.isConfirmed) {
                    eliminarProyecto(_id)
                }
            });
    }

    if(cargando) return "cargando..."

    return (
        <>
            <div className="mb-4 text-gray-500 text-lg cursor-default">
                <Link className="hover:text-black transition-colors" to="/proyectos">Proyectos</Link> / <Link className="hover:text-black transition-colors" to={`/proyectos/${_id}`}>{nombre}</Link> / <span className="text-sky-700 font-medium">Editar</span>
            </div>

            <div className="flex justify-between items-center">
                <h1 className="text-4xl font-black">{nombre}</h1>

                <button onClick={handleClick} className="flex items-center gap-2 text-gray-400 hover:text-black transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                    </svg>


                    <span className="uppercase font-bold">Eliminar</span>
                </button>
            </div>

            {alerta.msg && <div className="w-2/3 mx-auto"><Alerta alerta={alerta}/></div>}

            <div className="mt-10 flex justify-center">
                <FormularioProyecto/>
            </div>
        </>
    )
}

export default EditarProyecto