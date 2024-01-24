import { Link } from "react-router-dom"
import useAuth from "../hooks/useAuth"

const PreviewProyecto = ({proyecto}) => {

    const { auth } = useAuth()
    const { nombre, _id, cliente, creador } = proyecto

    return (
        <div className="border-b p-5 flex gap-3 md:gap-0 md:flex-row items-center justify-between">
            <div className="flex flex-col items-start lg:items-center justify-between md:justify-normal lg:flex-row gap-3">
                <div className="lg:flex lg:items-center lg:gap-2">
                    <p>{nombre}</p>
                    <span className="text-gray-500 text-sm uppercase">{cliente}</span>
                </div>

                {creador != auth._id && <span className="p-1 bg-green-400 text-white uppercase font-bold text-xs rounded-lg">Colaborador</span>}
            </div>

            <Link className="text-gray-600 hover:text-gray-800 uppercase text-sm font-bold md:self-auto" to={`${_id}`}>Ver Proyecto</Link>
        </div>
    )
}

export default PreviewProyecto