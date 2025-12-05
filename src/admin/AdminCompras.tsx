import { useEffect, useState } from "react"

import type { CompraType } from "../utils/CompraType"
import ItemCompra from "./components/ItemCompra"

const apiUrl = import.meta.env.VITE_API_URL

function ControleCompras() {
    const [compras, setCompras] = useState<CompraType[]>([])

    useEffect(() => {
        async function getCompras() {
            try {
                const response = await fetch(`${apiUrl}/compras`)
                const dados = await response.json()
                if (Array.isArray(dados)) {
                    setCompras(dados)
                } else {
                    console.error('Resposta não é array:', dados)
                    setCompras([])
                }
            } catch (error) {
                console.error('Erro ao buscar compras:', error)
                setCompras([])
            }
        }
        getCompras()
    }, [])

    const listaCompras = compras.map(compra => (
        <ItemCompra key={compra.id} compra={compra} compras={compras} setCompras={setCompras} />
    ))

    return (
        <div className='m-4 mt-24'>
            <h1 className="mb-4 text-2xl font-bold leading-none tracking-tight text-gray-900 md:text-3xl lg:text-4xl dark:text-gray-400">
                Controle de Compras
            </h1>

            <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            <th scope="col" className="px-6 py-3">
                                Foto do Produto
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Produto
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Cliente
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Quantidade
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Tamanho/Cor
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Valor Total R$
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Status
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Ações
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {listaCompras}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default ControleCompras
