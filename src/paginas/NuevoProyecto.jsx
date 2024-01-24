import FormularioProyecto from "../components/FormularioProyecto"
import useProyectos from "../hooks/useProyectos"
import Alerta from "../components/Alerta";

const NuevoProyecto = () => {

    const { alerta } = useProyectos();

    return (
        <>
            <h1 className="text-4xl font-black">Crear Proyecto</h1>

            {alerta.msg && <div className="w-2/3 mx-auto"><Alerta alerta={alerta}/></div>}

            <div className="mt-10 flex justify-center">
                <FormularioProyecto/>
            </div>
      </>
    )
}

export default NuevoProyecto