import { Fragment, useState, useEffect, useRef } from 'react'
import { useParams } from 'react-router-dom'
import { Dialog, Transition } from '@headlessui/react'
import useProyectos from '../hooks/useProyectos'
import Alerta from './Alerta'
import limpiarForm from "../helpers/limpiarForm"

const PRIORIDADES = ["Baja", "Media", "Alta"]

const ModalFormularioTarea = () => {
 
    const params = useParams()

    const [id, setId] = useState(null)
    const [nombre, setNombre] = useState("")
    const [descripcion, setDescripcion] = useState("")
    const [prioridad, setPrioridad] = useState("Baja")
    const [fechaEntrega, setFechaEntrega] = useState("")
    const [error, setError] = useState(false)
    const [cargando, setCargando] = useState(false)

    const form = useRef()

    const { modalFormularioTarea, handleModalTarea, mostrarAlerta, alerta, submitTarea, tarea } = useProyectos()

    useEffect(() =>{
        if(tarea._id){
            setId(tarea._id)
            setNombre(tarea.nombre)
            setDescripcion(tarea.descripcion)
            setPrioridad(tarea.prioridad)
            setFechaEntrega(tarea.fechaEntrega.split('T')[0])
            return
        }
        setId(null)
        setNombre("")
        setDescripcion("")
        setPrioridad("Baja")
        setFechaEntrega("")
    }, [tarea])


    const handleSubmit = async (e) =>{
        e.preventDefault()
        const campos = [...form.current.elements].filter(campo => campo.type != "submit")
        if([nombre, descripcion, prioridad, fechaEntrega].includes("")){
            campos.forEach(campo =>{
                if(!campo.value){
                    campo.classList.add("outline-red-500", "outline", "outline-2")
                    campo.classList.remove("outline-sky-400")
                }
            })
            setError(true)
            return mostrarAlerta({msg: 'Todos los campos son obligatorios.', error: true}, 2500)
        }
        setError(false)

        setCargando(true)
        await submitTarea(limpiarForm({id, nombre, descripcion, fechaEntrega, prioridad, proyecto: params.id}))
        setCargando(false)

        setId(null)
        setNombre("")
        setFechaEntrega("")
        setPrioridad("Baja")
        setDescripcion("")
    }

    const erroresForm = (e)=>{
        if(error){
            if(!e.target.value) {
                e.target.classList.add("outline-red-500", "outline", "outline-2")
                e.target.classList.remove("outline-sky-400")
                /* mostrarAlerta({
                    msg: "Todos Los Campos Son Obligatorios.",
                    error: true
                }) */
            }else{
                e.target.classList.remove("outline-red-500", "outline", "outline-2")
                e.target.classList.add("outline-sky-400")
            }
        }
        const campos = [...e.target.parentNode.parentNode.elements].filter(campo => campo.type != "submit")
        if(!campos.some(campo => campo.classList.contains("outline-red-500"))) {
            mostrarAlerta({})
        }
    }

    return (
        <Transition.Root show={modalFormularioTarea} as={Fragment}>
            <Dialog as="div" className="fixed z-10 inset-0 overflow-y-auto" onClose={handleModalTarea}>
                <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <Dialog.Overlay 
                            className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" 
                        />
                    </Transition.Child>

                    {/* This element is to trick the browser into centering the modal contents. */}
                    <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
                        &#8203;
                    </span>

                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                        enterTo="opacity-100 translate-y-0 sm:scale-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                        leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                    >
                            <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">


                            <div className="hidden sm:block absolute top-0 right-0 pt-4 pr-4">
                                <button
                                    type="button"
                                    className="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                    onClick={handleModalTarea}
                                >
                                <span className="sr-only">Cerrar</span>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                    </svg>
                                </button>
                            </div>


                            <div className="sm:flex sm:items-start">
                                <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                                    <Dialog.Title as="h3" className="text-xl leading-6 font-bold text-gray-900">
                                        {id ? 'Editar Tarea' : 'Crear Tarea'}
                                    </Dialog.Title>

                                    {alerta.msg && <Alerta alerta={alerta}/>}

                                    <form ref={form} onChange={erroresForm} onSubmit={handleSubmit} className='mt-10 mb-3'>
                                        <div className='mb-5'>
                                            <label htmlFor='nombre' className='mb-2 block text-gray-700 uppercase text-sm font-bold'>Nombre Tarea</label>
                                            <input id='nombre' type='text' value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder='Nombre de la Tarea' className='border-2 w-full p-2 rounded-lg placeholder-gray-400 outline-sky-400 focus:outline focus:outline-2'/>
                                        </div>

                                        <div className='mb-5'>
                                            <label htmlFor='descripcion' className='mb-2 block text-gray-700 uppercase text-sm font-bold'>Descripción</label>
                                            <textarea id='descripcion' value={descripcion} onChange={(e) => setDescripcion(e.target.value)} placeholder='Descripción de la Tarea' className='border-2 w-full p-2 rounded-lg placeholder-gray-400 resize-none focus:outline-sky-400 focus:outline focus:outline-2'></textarea>
                                        </div>

                                        <div className='mb-5'>
                                            <label htmlFor='fecha' className='mb-2 block text-gray-700 uppercase text-sm font-bold'>Fecha Entrega</label>
                                            <input id='fecha' type='date' value={fechaEntrega} onChange={(e) => setFechaEntrega(e.target.value)} className='border-2 w-full p-2 rounded-lg placeholder-gray-400 focus:outline-sky-400 focus:outline focus:outline-2'/>
                                        </div>

                                        <div className='mb-5'>
                                            <label htmlFor='prioridad' className='mb-2 block text-gray-700 uppercase text-sm font-bold'>Prioridad</label>
                                            <select id="prioridad" value={prioridad} onChange={e => setPrioridad(e.target.value)} className='border-2 w-full p-2 rounded-lg bg-white focus:outline-sky-400 focus:outline focus:outline-2'>
                                                {PRIORIDADES.map(opcion => (
                                                    <option key={opcion}>{opcion}</option>
                                                ))}
                                            </select>
                                        </div>

                                        <input disabled={cargando ? 'disabled' : ''} type='submit' value={id ? 'Guardar Cambios' : (cargando ? "Cargando..." :  'Crear Tarea')} className={'mt-3 bg-sky-500 p-3 w-full text-white uppercase font-bold rounded-md cursor-pointer hover:bg-sky-600 transition-colors' + (cargando ? " bg-gray-300 hover:bg-gray-300" : '')}/>
                                    </form>

                                </div>
                            </div>
                        </div>
                    </Transition.Child>
                </div>
            </Dialog>
        </Transition.Root>
    )
}

export default ModalFormularioTarea