import { useState, useEffect, createContext } from "react";
import { useNavigate } from "react-router-dom";
import clienteAxios from "../config/clienteAxios";

const AuthContext = createContext()

import React from 'react'

const AuthProvider = ({children}) => {

    const [auth, setAuth] = useState({})
    const [isLoading, setIsLoading] = useState(true)

    const navigate = useNavigate()

    useEffect(() => {
        const autenticarUsuario = async () => {
            const token = localStorage.getItem('token')
            if(!token){
                setIsLoading(false)
                return
            }

            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            }

            try {
                const { data } = await clienteAxios('/usuarios/perfil', config)
                setAuth(data)
                // navigate('/proyectos')

            } catch (error) {
                setAuth({})
            } 

            setIsLoading(false)

            
        }
        autenticarUsuario() 
    }, [])

    const cerrarSesionAuth = () =>{
        setAuth({})
    }
    
    return (
        <AuthContext.Provider
            value={{
                auth,
                setAuth,
                isLoading,
                cerrarSesionAuth
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}

export {
    AuthProvider
}

export default AuthContext