import { useState, useEffect, useRef, useLayoutEffect } from "react"
import { useParams } from "react-router-dom"
import useProyectos from "../hooks/useProyectos"

const FormularioProyecto = () => {

    const params = useParams()

    const [id, setId] = useState(null)
    const [nombre, setNombre] = useState("")
    const [descripcion, setDescripcion] = useState("")
    const [fechaEntrega, setFechaEntrega] = useState("")
    const [cliente, setCliente] = useState("")

    const [error, setError] = useState(false)
    const form = useRef()

    const { mostrarAlerta, submitProyecto, proyecto } = useProyectos()

    useEffect(() =>{
        if(params.id){
            setId(proyecto._id)
            setNombre(proyecto.nombre)
            setDescripcion(proyecto.descripcion)
            setFechaEntrega(proyecto.fechaEntrega?.split('T')[0])
            setCliente(proyecto.cliente)
        }
    }, [])

    useLayoutEffect(() =>{
        const campos = [...form.current.elements].filter(campo => campo.type != "submit")
        if(error){
            campos.forEach(campo => {
                if(!campo.value || (campo.value.length <= 3 && campo.id != "cliente") || (campo.id == "descripcion" && campo.value.trim().length <= 3)){
                    campo.classList.add("outline-rose-500", "outline")
                }
            })
        }else{
            campos.forEach(campo => {
                if(!campo.value || campo.value.length <= 3){
                    campo.classList.remove("outline-rose-500", "outline")
                }
            })
        }
    }, [error])

    const handleSubmit = async (e) =>{
        e.preventDefault();
        const states = [nombre, descripcion.trim(), fechaEntrega, cliente]
        if(states.includes("") || states.some(state => state != states[3] && (state.length <= 3))){
            setError(true)
            return mostrarAlerta({
                msg: "Todos Los Campos Son Obligatorios.",
                error: true
            })
        }
        mostrarAlerta({})

        await submitProyecto({id, nombre, descripcion: descripcion.trim(), fechaEntrega, cliente})

        setError(false)
        setId(null)
        setNombre("")
        setDescripcion("")
        setFechaEntrega("")
        setCliente("")
    }

    const erroresForm = (e)=>{
        if(error){
            if((e.target.value.length <= 3 && e.target.id != "cliente") || !e.target.value || (e.target.id == "descripcion" && e.target.value.trim().length <= 3)) {
                e.target.classList.add("outline-rose-500", "outline")
                mostrarAlerta({
                    msg: "Todos Los Campos Son Obligatorios.",
                    error: true
                })
            }else{
                e.target.classList.remove("outline-rose-500", "outline")
            }
        }
        const campos = [...e.target.parentNode.parentNode.elements].filter(campo => campo.type != "submit")
        if(!campos.some(campo => campo.classList.contains("outline-rose-500"))) {
            mostrarAlerta({})
        }
    }

    return (
        <form id="form" ref={form} onChange={erroresForm} onSubmit={handleSubmit} className="bg-white py-10 px-5 md:w-1/2 rounded-lg shadow">
            <div className="campo mb-5">
                <label htmlFor="nombre" className="text-gray-700 uppercase font-bold text-sm block">Nombre Proyecto</label>
                <input value={nombre} onChange={(e) => setNombre(e.target.value)} id="nombre" type="text" className="w-full border rounded-md p-2 mt-2 placeholder-gray-400" placeholder="Nombre De Tu Proyecto"/>
            </div>
            <div className="campo mb-5">
                <label htmlFor="descripcion" className="text-gray-700 uppercase font-bold text-sm block">Descripción Proyecto</label>
                <textarea id="descripcion" value={descripcion} onChange={(e) => setDescripcion(e.target.value)} className="w-full border rounded-md p-2 mt-2 placeholder-gray-400" placeholder="Describe Tu Proyecto"></textarea>
            </div>
            <div className="campo mb-5">
                <label htmlFor="fecha-entrega" className="text-gray-700 uppercase font-bold text-sm block">Fecha de Entrega</label>
                <input value={fechaEntrega} onChange={(e) => setFechaEntrega(e.target.value)} id="fecha-entrega" type="date" className="w-full border rounded-md p-2 mt-2 placeholder-gray-400"/>
            </div>
            <div className="campo mb-5">
                <label htmlFor="cliente" className="text-gray-700 uppercase font-bold text-sm block">Cliente Proyecto</label>
                <input value={cliente} onChange={(e) => setCliente(e.target.value)} id="cliente" type="text" className="w-full border rounded-md p-2 mt-2 placeholder-gray-400" placeholder="Nombre De Tu Proyecto"/>
            </div>

            <input type="submit" value={id ? "Guardar Cambios" : "Crear Proyecto"} className={`bg-sky-600 hover:bg-sky-700 w-full p-3 mt-2 text-white uppercase font-bold rounded-lg cursor-pointer transition-colors`}/> 
        </form>
    )
}

export default FormularioProyecto