import { Link } from "react-router-dom"
import { useState } from "react"
import Alerta from "../components/Alerta"
import clienteAxios from "../config/clienteAxios"

const Registrar = () => {
    const [nombre, setNombre] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [repetirPassword, setRepetirPassword] = useState("")
    const [alerta, setAlerta] = useState({})

    const handleSubmit = async (e) =>{
        e.preventDefault();
        if([nombre, email, password, repetirPassword].includes('')){
            setAlerta({
                msg: 'Todos los Campos son Obligatorios.',
                error: true
            })
            return
        }
        if(password != repetirPassword){
            setAlerta({
                msg: 'Las Contraseñas No Son Iguales.',
                error: true
            })
            return
        }
        if(password.length < 6){
            setAlerta({
                msg: 'La Contraseña Debe Ser Mayor a 6 Caractéres.',
                error: true
            })
            return
        }

        setAlerta({})

        // Crear el usuario en la api
        try {
            const {data} = await clienteAxios.post(`/usuarios`, {
                nombre,
                password, 
                email
            })
            setAlerta(data)

            setNombre("")
            setEmail("")
            setPassword("")
            setRepetirPassword("")
        } catch (error) {
            const {data} = error.response
            setAlerta(data)
        }
    }

    return (
        <>
            <h1 className=" text-sky-600 font-black text-6xl capitalize">Regístrate y Empieza a Organizar tus <span className="text-slate-700">Proyectos</span></h1>

            {alerta?.msg && <Alerta alerta={alerta}/>}

            <form onSubmit={handleSubmit} className="my-10 bg-white shadow rounded-lg p-10">
                <div className="my-5">
                    <label className="uppercase text-gray-600 block text-xl font-bold" htmlFor="nombre">Nombre</label>
                    <input value={nombre} onChange={e => setNombre(e.target.value)} type="text" id="nombre" placeholder="Tu Nombre" className="w-full mt-3 p-3 border rounded-xl bg-gray-50 focus:outline outline-sky-600" />
                </div>

                <div className="my-5">
                    <label className="uppercase text-gray-600 block text-xl font-bold" htmlFor="email">Email</label>
                    <input value={email} onChange={e => setEmail(e.target.value)} type="text" id="email" placeholder="Email de Registro" className="w-full mt-3 p-3 border rounded-xl bg-gray-50 focus:outline outline-sky-600" />
                </div>

                <div className="my-5">
                    <label className="uppercase text-gray-600 block text-xl font-bold" htmlFor="password">Contraseña</label>
                    <input value={password} onChange={e => setPassword(e.target.value)} type="password" id="password" placeholder="Tu Contraseña" className="w-full mt-3 p-3 border rounded-xl bg-gray-50 focus:outline outline-sky-600" />
                </div>
                
                <div className="my-5">
                    <label className="uppercase text-gray-600 block text-xl font-bold" htmlFor="password2">Confirmar Contraseña</label>
                    <input value={repetirPassword} onChange={e => setRepetirPassword(e.target.value)} type="password" id="password2" placeholder="Confirma Tu Contraseña" className="w-full mt-3 p-3 border rounded-xl bg-gray-50 focus:outline outline-sky-600" />
                </div>

                <input type="submit" value="Crear Cuenta" className="w-full p-3 bg-sky-600 my-5 text-white uppercase font-bold rounded-md hover:cursor-pointer hover:bg-sky-800 transition-colors"/>
            </form>

            <nav className="lg:flex lg:justify-between">
                <Link className="block text-center my-5 text-slate-500" to="/">
                    ¿Ya Tienes una Cuenta? Inicia Sesión
                </Link>

                <Link className="block text-center my-5 text-slate-500" to="/olvide-password">
                    Olvidé Mi Contraseña
                </Link>
            </nav>
        </>
    )
}

export default Registrar