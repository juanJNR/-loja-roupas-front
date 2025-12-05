import { useEffect, useState } from "react"
import type { ClienteType } from "../utils/ClienteType"

const apiUrl = import.meta.env.VITE_API_URL

export default function AdminClientes() {
    const [clientes, setClientes] = useState<ClienteType[]>([])

    useEffect(() => {
        async function getClientes() {
            try {
                const response = await fetch(`${apiUrl}/clientes`)
                const dados = await response.json()
                if (Array.isArray(dados)) {
                    setClientes(dados)
                } else {
                    console.error('Resposta não é array:', dados)
                    setClientes([])
                }
            } catch (error) {
                console.error('Erro ao buscar clientes:', error)
                setClientes([])
            }
        }
        getClientes()
    }, [])

    return (
        <div className='m-4 mt-24'>
            <h1 className="mb-4 text-2xl font-bold leading-none tracking-tight text-black md:text-3xl lg:text-4xl">
                Controle de Clientes
            </h1>

            <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                <table className="w-full text-sm text-left rtl:text-right text-gray-500">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3">
                                Nome
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Email
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Cidade
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Data Cadastro
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {clientes.map(cliente => (
                            <tr key={cliente.id} className="bg-white border-b hover:bg-gray-50">
                                <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                                    {cliente.nome}
                                </th>
                                <td className="px-6 py-4">
                                    {cliente.email}
                                </td>
                                <td className="px-6 py-4">
                                    {cliente.cidade || '-'}
                                </td>
                                <td className="px-6 py-4">
                                    {cliente.createdAt ? new Date(cliente.createdAt).toLocaleDateString('pt-BR') : '-'}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {clientes.length === 0 && (
                <p className="text-center mt-4 text-gray-500">Nenhum cliente cadastrado</p>
            )}
        </div>
    )
}
