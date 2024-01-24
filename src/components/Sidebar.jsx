import { Link } from "react-router-dom"
import useAuth from "../hooks/useAuth"

const Sidebar = () => {

    const { auth } = useAuth()
    return (
        <aside className="md:w-1/3 lg:w-1/5 xl:w-1/6 px-5 py-10">
            <p className="text-xl font-bol">Hola: {auth.nombre}</p>

            <Link className="bg-sky-600 block w-full p-3 mt-5 text-center rounded-lg text-white uppercase font-bold" to={"crear-proyecto"}>Nuevo Proyecto</Link>
        </aside>
    )
}

export default Sidebar