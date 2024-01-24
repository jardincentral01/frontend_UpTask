import { useState, useEffect, createContext } from "react"
import { useNavigate } from "react-router-dom"
import clienteAxios from "../config/clienteAxios"
import useAuth from "../hooks/useAuth"
import io from "socket.io-client"

let socket;

const ProyectosContext = createContext()

const ProyectosProvider = ({children}) => {

    const [proyectos, setProyectos] = useState([])
    const [alerta, setAlerta] = useState([])
    const [proyecto, setProyecto] = useState({})
    const [tarea, setTarea] = useState({})
    const [colaborador, setColaborador] = useState({})
    const [emailColaborador, setEmailColaborador] = useState("")
    const [cargando, setCargando] = useState(false)
    const [spinner, setSpinner] = useState(false)
    const [modalFormularioTarea, setModalFormularioTarea] = useState(false)
    const [modalEliminarTarea, setModalEliminarTarea] = useState(false)
    const [modalEliminarColaborador, setModalEliminarColaborador] = useState(false)
    const [buscador, setBuscador] = useState(false)

    const { auth } = useAuth()
    const navigate = useNavigate()

    const mostrarAlerta = (alerta, tiempo) =>{
        setAlerta(alerta)

        if(tiempo){
            setTimeout(() =>{
                setAlerta({})
            }, tiempo)
        }
    }

    useEffect(() =>{
        const obtenerProyectos = async () =>{
            try {
                const token = localStorage.getItem("token")
                const config = {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    }
                }
                const { data } = await clienteAxios("/proyectos/", config)
                setProyectos(data)
            } catch (error) {
                console.log(error)
            }
        }
        obtenerProyectos()
    }, [auth])

    useEffect(() =>{
        socket = io(import.meta.env.VITE_BACKEND_URL)
    }, [])

    const submitProyecto = async (proyecto) =>{

        if(proyecto.id){
            await actualizarProyecto(proyecto)
        }else{
            await nuevoProyecto(proyecto)
        }
        
    }

    const nuevoProyecto = async (proyecto) =>{
        try {
            const token = localStorage.getItem("token")
            if(!token) throw "No Tienes Acceso."
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            }
            const { data } = await clienteAxios.post("/proyectos/", proyecto, config)
            mostrarAlerta({msg: "¡Proyecto Creado Con Éxito!"})
            setProyectos([...proyectos, data])
            navigate("/proyectos")
        } catch (error) {
            mostrarAlerta({msg: "Hubo un error.", error: true}, 2500)
        }
    }

    const actualizarProyecto = async (proyecto) =>{
        try {
            const token = localStorage.getItem("token")
            if(!token) throw "No Tienes Acceso."
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            }
            const { data } = await clienteAxios.put(`/proyectos/${proyecto.id}`, proyecto, config)
            mostrarAlerta({msg: "¡Proyecto Actualizado Con Éxito!"})
            const proyectosActualizados = proyectos.map(proyectoState => proyectoState._id === data._id ? data : proyectoState)
            setProyectos(proyectosActualizados)
            navigate(`/proyectos`)
        } catch (error) {
            mostrarAlerta({msg: "Hubo un error.", error: true}, 2500)
        }
    }

    const eliminarProyecto = async (id) => {
        try {
            const token = localStorage.getItem("token")
            if(!token) throw "No Tienes Acceso."
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            }
            const { data } = await clienteAxios.delete(`/proyectos/${id}`, config)
            mostrarAlerta(data)
            const proyectosFiltrados = proyectos.filter(proyectoState => proyectoState._id != id)
            setProyectos(proyectosFiltrados)
            navigate(`/proyectos`)
        } catch (error) {
            mostrarAlerta(error.response.data, 2500)
        }
    }

    const obtenerProyecto = async (id) =>{
        setCargando(true)
        try {
            const token = localStorage.getItem("token")
            if(!token) throw "No Tienes Acceso."
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            }
            const { data } = await clienteAxios(`/proyectos/${id}`, config)
            setProyecto(data)
            setAlerta({})
        } catch (error) {
            mostrarAlerta(error.response.data)
            navigate("/proyectos")
        }
        setCargando(false)
    }

    const handleModalCrearTarea = () =>{
        setModalFormularioTarea(!modalFormularioTarea)
        setTarea({})
    }

    const handleModalTarea = () =>{
        setModalFormularioTarea(!modalFormularioTarea)
    }

    
    const handleModalEditarTarea = (tarea) =>{
        setTarea(tarea)
        setModalFormularioTarea(true)
    }

    const handleModalEliminarTarea = (tarea) =>{
        setTarea(tarea)
        setModalEliminarTarea(!modalEliminarTarea)
    }

    const closeModalEliminarTarea = () =>{
        setTarea({})
        setModalEliminarTarea(!modalEliminarTarea)
    }

    const eliminarTarea = async () =>{
        try {
            const token = localStorage.getItem("token")
            if(!token) throw "No Tienes Acceso."
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            }
            const { data } = await clienteAxios.delete(`/tareas/${tarea._id}`, config)
            
            await socket.emit("eliminar-tarea", tarea)

            mostrarAlerta(data, 3000)
            setModalEliminarTarea(false)
            setTarea({})
        } catch (error) {
            mostrarAlerta({msg: 'Hubo un error.', error: true}, 3000)
        }
    }

    const submitTarea = async (tarea) =>{
        if(tarea.id){
            await editarTarea(tarea)
        }else{
            await nuevaTarea(tarea)
        }
    }

    const nuevaTarea = async (tarea) =>{
        try {
            const token = localStorage.getItem("token")
            if(!token) throw "No Tienes Acceso."
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            }
            const { data } = await clienteAxios.post(`/tareas`, tarea, config)

            await socket.emit("nueva-tarea", data)

            setAlerta({})
            setModalFormularioTarea(false)
        } catch (error) {
            mostrarAlerta({msg: 'Hubo un error.', error: true}, 3000)
        }
    }

    const editarTarea = async (tarea) =>{
        try {
            const token = localStorage.getItem("token")
            if(!token) throw "No Tienes Acceso."
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            }
            const { data } = await clienteAxios.put(`/tareas/${tarea.id}`, tarea, config)

            await socket.emit("editar-tarea", data)
            
            setAlerta({})
            setModalFormularioTarea(false)
        } catch (error) {
            mostrarAlerta({msg: 'Hubo un error.', error: true}, 3000)
        }
    }

    const submitColaborador = async email =>{
        setSpinner(true)
        try {
            const token = localStorage.getItem("token")
            if(!token) throw "No Tienes Acceso."
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            }
            const { data } = await clienteAxios.post("/proyectos/colaboradores", {email}, config)
            
            setColaborador(data)
            setAlerta({})
        } catch (error) {
            setColaborador({})
            mostrarAlerta(error.response.data, 3500)
        }
        setSpinner(false)
    }

    const agregarColaborador = async email =>{
        try {
            const token = localStorage.getItem("token")
            if(!token) throw "No Tienes Acceso."
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            }
            const { data } = await clienteAxios.post(`/proyectos/colaboradores/${proyecto._id}`, email, config)
            mostrarAlerta(data, 3500)
            setColaborador({})
            setEmailColaborador("")
        } catch (error) {
            mostrarAlerta(error.response.data, 3500)
        }
    } 

    const handleModalEliminarColaborador = (colaborador) =>{
        setColaborador(colaborador)
        setModalEliminarColaborador(!modalEliminarColaborador);
    }

    const eliminarColaborador = async () =>{
        try {
            const token = localStorage.getItem("token")
            if(!token) throw "No Tienes Acceso."
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            }

            const { data } = await clienteAxios.post(`/proyectos/eliminar-colaborador/${proyecto._id}`, {id: colaborador._id}, config)

            const proyectoActualizado = {...proyecto}
            proyectoActualizado.colaboradores = proyectoActualizado.colaboradores.filter(colaboradorState => colaboradorState._id != colaborador._id )
            
            setProyecto(proyectoActualizado)
            mostrarAlerta(data, 3000)
            setModalEliminarColaborador(false)
            setColaborador({})
        } catch (error) {
            mostrarAlerta(error.response.data, 3000)
        }
    }

    const completarTarea = async (id) =>{
        setSpinner(true)
        try {
            const token = localStorage.getItem("token")
            if(!token) throw "No Tienes Acceso."
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            }

            const { data } = await clienteAxios.post(`/tareas/estado/${id}`, {}, config)

            await socket.emit("completar-tarea", data)
            
        } catch (error) {
            console.log(error.response.data)
        }
        setSpinner(false)
    }

    const handleBuscador = () =>{
        setBuscador(!buscador)
    }

    const loadTareas = (metodo, tarea) =>{
        switch (metodo) {
            case "agregar":
                submitTareasProyecto(tarea)
                break;

            case "eliminar":
                eliminarTareasProyecto(tarea)
                break;
            
            case "editar":
                editarTareasProyecto(tarea)
                break

            case "completar":
                completarTareasProyecto(tarea)
                break
        }
        
    }

    const submitTareasProyecto = (tareaNueva) =>{
        const proyectoActualizado = {...proyecto}
        proyectoActualizado.tareas = [...proyectoActualizado.tareas, tareaNueva]
        setProyecto(proyectoActualizado)
    }

    const eliminarTareasProyecto = (tareaEliminada) =>{
        const proyectoActualizado = {...proyecto}
        proyectoActualizado.tareas = proyectoActualizado.tareas.filter(tareaState => tareaState._id != tareaEliminada._id )
        setProyecto(proyectoActualizado)
    }

    const completarTareasProyecto = (tareaCompletada) =>{
        const proyectoActualizado = {...proyecto}
        proyectoActualizado.tareas = proyectoActualizado.tareas.map(tareaState => tareaState._id == tareaCompletada._id ? tareaCompletada : tareaState)
        setProyecto(proyectoActualizado)
    }

    const editarTareasProyecto = (tareaEditada) =>{
        const proyectoActualizado = {...proyecto}
        proyectoActualizado.tareas = proyectoActualizado.tareas.map(tareaState => tareaState._id == tareaEditada._id ? tareaEditada : tareaState)
        setProyecto(proyectoActualizado)
    }

    const cerrarSesionProyectos = () =>{
        setProyectos({})
        setProyecto({})
        setAlerta({})
    }

    return (
        <ProyectosContext.Provider
            value={{
                proyectos,
                mostrarAlerta,
                alerta,
                submitProyecto,
                obtenerProyecto,
                proyecto,
                cargando,
                actualizarProyecto,
                eliminarProyecto,
                modalFormularioTarea,
                handleModalCrearTarea,
                handleModalTarea,
                submitTarea,
                handleModalEditarTarea,
                tarea,
                modalEliminarTarea,
                handleModalEliminarTarea,
                closeModalEliminarTarea,
                eliminarTarea,
                submitColaborador,
                colaborador,
                spinner,
                agregarColaborador,
                setColaborador,
                modalEliminarColaborador,
                handleModalEliminarColaborador,
                eliminarColaborador,
                emailColaborador,
                setEmailColaborador,
                completarTarea,
                buscador,
                handleBuscador,
                loadTareas,
                cerrarSesionProyectos
            }}
        >
            {children}
        </ProyectosContext.Provider>
    )
}

export {
    ProyectosProvider
}

export default ProyectosContext