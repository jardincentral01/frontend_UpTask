import useProyectos from "../hooks/useProyectos";

const Colaborador = ({colaborador}) => {

    const { handleModalEliminarColaborador } = useProyectos()
    const { nombre, email } = colaborador;
    return (
        <div className="border-b px-3 md:px-5 py-5 flex justify-between items-center">
            <div>
                <p>{nombre}</p>
                <p className="text-sm text-gray-700">{email}</p>
            </div>

            <div>
                <button onClick={() => handleModalEliminarColaborador(colaborador)} type="button" className="px-4 py-3 bg-red-600 hover:bg-red-700 transition-colors text-sm uppercase font-bold text-white rounded-lg">Eliminar</button>
            </div>
        </div>
    )
}

export default Colaborador