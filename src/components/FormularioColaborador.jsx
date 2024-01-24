import { useState } from "react"
import useProyectos from "../hooks/useProyectos"

const FormularioColaborador = () => {

    //const [email, setEmail] = useState("")
    const [cargando, setCargando] = useState(false)
    const { mostrarAlerta, submitColaborador, setColaborador, emailColaborador, setEmailColaborador } = useProyectos()

    const handleSubmit = async e => {
        e.preventDefault();
        if(!email) { 
            setColaborador({})
            return mostrarAlerta({msg: "El Email Es Obligatorio.", error:true}, 2500)
        }

        setCargando(true)
        await submitColaborador(emailColaborador.trim())
        setCargando(false)
    }
    return (
        <form onSubmit={handleSubmit} className="relative bg-white px-5 py-10 rounded-lg shadow">
            <div>
                <div className="mb-5">
                    <label htmlFor="email" className="block uppercase font-bold mb-2 text-sm text-gray-700">Email Colaborador</label>
                    <input id="email" type="email" value={emailColaborador} onChange={(e) => setEmailColaborador(e.target.value)} placeholder="Email del Usuario" className="border-2 w-full p-2 rounded-lg focus:outline focus:outline-sky-400 focus:outline-2"/>
                </div>

                <input type="submit" value="Buscar Colaborador" className="bg-sky-600 hover:bg-sky-700 transition-colors p-3 mt-3 w-full rounded-md text-white font-bold uppercase cursor-pointer"/>
            </div>

            {cargando && (
                <>
                <div className="absolute top-0 start-0 w-full h-full bg-white/[.6] rounded-lg"></div>

                <div className="absolute top-1/2 start-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <div className="animate-spin inline-block w-14 h-14 border-[5px] border-current border-t-transparent text-sky-600 rounded-full dark:text-sky-500" role="status" aria-label="loading">
                    <span className="sr-only">Loading...</span>
                    </div>
                </div>
                </>
            )}
        </form>
    )
}

export default FormularioColaborador