import { useEffect, useState } from "react";
import { useClienteStore } from "./context/ClienteContext";
import type { CompraType } from "./utils/CompraType";

const apiUrl = import.meta.env.VITE_API_URL

export default function MinhasCompras() {
    const [compras, setCompras] = useState<CompraType[]>([])
    const { cliente } = useClienteStore()

    useEffect(() => {
        async function buscaDados() {
            try {
                const response = await fetch(`${apiUrl}/compras/${cliente.id}`)
                const dados = await response.json()
                // Verifica se dados é um array antes de setar
                if (Array.isArray(dados)) {
                    setCompras(dados)
                } else {
                    console.error('Resposta da API não é um array:', dados)
                    setCompras([])
                }
            } catch (error) {
                console.error('Erro ao buscar compras:', error)
                setCompras([])
            }
        }
        buscaDados()
    }, [])

    // para retornar apenas a data do campo no banco de dados
    // 2024-10-10T22:46:27.227Z => 10/10/2024
    function dataDMA(data: string) {
        const ano = data.substring(0, 4)
        const mes = data.substring(5, 7)
        const dia = data.substring(8, 10)
        return dia + "/" + mes + "/" + ano
    }

    const comprasTable = compras.map(compra => (
        <tr key={compra.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
            <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                <p><b>{compra.produto.marca.nome} {compra.produto.nome}</b></p>
                <p className='mt-3'>
                    R$: {Number(compra.produto.preco).toLocaleString("pt-br", { minimumFractionDigits: 2 })}
                </p>
            </th>
            <td className="px-6 py-4">
                <img src={compra.produto.foto || "/placeholder.jpg"} className="fotoCarro" alt="Foto Produto" />
            </td>
            <td className="px-6 py-4">
                <p><b>Quantidade:</b> {compra.quantidade}</p>
                {compra.tamanho && <p><b>Tamanho:</b> {compra.tamanho}</p>}
                {compra.cor && <p><b>Cor:</b> {compra.cor}</p>}
                <p className='mt-2'><b>Total:</b> R$ {Number(compra.valorTotal).toLocaleString("pt-br", { minimumFractionDigits: 2 })}</p>
            </td>
            <td className="px-6 py-4">
                <span className={`px-2 py-1 rounded text-xs font-semibold ${compra.status === "concluída"
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}>
                    {compra.status}
                </span>
                <p className='mt-2'><i>Em: {dataDMA(compra.createdAt)}</i></p>
            </td>
        </tr>
    ))

    return (
        <section className="max-w-7xl mx-auto">
            <h1 className="mb-6 mt-4 text-3xl font-extrabold leading-none tracking-tight text-gray-900 md:text-4xl lg:text-5xl dark:text-gray-400">
                Minhas <span className="underline underline-offset-3 decoration-8 decoration-orange-400 dark:decoration-orange-600">Compras</span>
            </h1>

            {compras.length == 0 ?
                <h2 className="mb-4 mt-10 text-3xl font-extrabold leading-none tracking-tight text-gray-900 md:text-4xl dark:text-gray-400">
                    &nbsp;&nbsp; Você ainda não realizou nenhuma compra. 🛒
                </h2>
                :
                <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            <th scope="col" className="px-6 py-3">
                                Produto
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Foto
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Detalhes
                            </th>
                            <th scope="col" className="px-6 py-3">
                                Status
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {comprasTable}
                    </tbody>
                </table>
            }
        </section>
    )
}
