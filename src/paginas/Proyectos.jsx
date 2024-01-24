import { useEffect } from "react"
import useProyectos from "../hooks/useProyectos"
import Alerta from "../components/Alerta"
import PreviewProyecto from "../components/PreviewProyecto"

const Proyectos = () => {

    const { proyectos, alerta, mostrarAlerta } = useProyectos()

    useEffect(() =>{
        if(alerta.msg){
            setTimeout(() =>{
                mostrarAlerta({})
            }, 2500)
        }
    }, [alerta])
    
    return (
      <>
        <h1 className="text-4xl font-black">Proyectos</h1>
        
        {alerta.msg &&  <div className="w-2/3 mx-auto"><Alerta alerta={alerta}/></div>}

        <div className="bg-white shadow mt-10 rounded-lg">
            {proyectos.length ? (
                proyectos.map(proyecto => (
                    <PreviewProyecto key={proyecto._id} proyecto={proyecto}/>
                ))
            ) : <p className="uppercase text-gray-700 text-center p-5">No Hay Proyectos Aún</p>}
        </div>
      </>
    )
}

export default Proyectos