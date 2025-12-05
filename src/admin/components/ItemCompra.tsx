import { TiDeleteOutline } from "react-icons/ti"
import { FaCheck } from "react-icons/fa"
import type { CompraType } from "../../utils/CompraType"
import { useAdminStore } from "../context/AdminContext"

type ItemCompraProps = {
    compra: CompraType
    compras: CompraType[]
    setCompras: React.Dispatch<React.SetStateAction<CompraType[]>>
}

const apiUrl = import.meta.env.VITE_API_URL

export default function ItemCompra({ compra, compras, setCompras }: ItemCompraProps) {
    const { admin } = useAdminStore()

    async function excluirCompra() {
        if (confirm(`Confirma Exclusão da Compra #${compra.id}?`)) {
            const response = await fetch(`${apiUrl}/compras/${compra.id}`,
                {
                    method: "DELETE",
                    headers: {
                        "Content-type": "application/json",
                        Authorization: `Bearer ${admin.token}`
                    },
                },
            )

            if (response.status == 200) {
                const compras2 = compras.filter(x => x.id != compra.id)
                setCompras(compras2)
                alert("Compra excluída com sucesso")
            } else {
                alert("Erro... Compra não foi excluída")
            }
        }
    }

    async function alterarStatus() {
        const novoStatus = prompt(
            `Status atual: ${compra.status}\n\nNovo status:`,
            compra.status === "processando" ? "concluída" : "processando"
        )

        if (novoStatus == null || novoStatus.trim() == "") {
            return
        }

        const response = await fetch(`${apiUrl}/compras/${compra.id}/status`,
            {
                method: "PATCH",
                headers: {
                    "Content-type": "application/json",
                    Authorization: `Bearer ${admin.token}`
                },
                body: JSON.stringify({ status: novoStatus })
            },
        )

        if (response.status == 200) {
            const compras2 = compras.map(x => {
                if (x.id == compra.id) {
                    return { ...x, status: novoStatus }
                }
                return x
            })
            setCompras(compras2)
            alert("Status atualizado com sucesso")
        }
    }

    return (
        <tr key={compra.id} className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700">
            <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                <img src={compra.produto.foto || "/placeholder.jpg"} alt="Foto do Produto"
                    style={{ width: 120 }} />
            </th>
            <td className="px-6 py-4">
                {compra.produto.marca.nome} {compra.produto.nome}
                <br />
                <span className="text-xs text-gray-500">
                    R$ {Number(compra.produto.preco).toLocaleString("pt-br", { minimumFractionDigits: 2 })}
                </span>
            </td>
            <td className="px-6 py-4">
                {compra.cliente.nome}
                <br />
                <span className="text-xs text-gray-500">{compra.cliente.email}</span>
            </td>
            <td className="px-6 py-4">
                {compra.quantidade}
            </td>
            <td className="px-6 py-4">
                {compra.tamanho && <div>Tam: {compra.tamanho}</div>}
                {compra.cor && <div>Cor: {compra.cor}</div>}
            </td>
            <td className="px-6 py-4">
                {Number(compra.valorTotal).toLocaleString("pt-br", { minimumFractionDigits: 2 })}
            </td>
            <td className="px-6 py-4">
                <span className={`px-2 py-1 rounded text-xs font-semibold ${compra.status === "concluída"
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}>
                    {compra.status}
                </span>
            </td>
            <td className="px-6 py-4">
                <TiDeleteOutline className="text-3xl text-red-600 inline-block cursor-pointer" title="Excluir"
                    onClick={excluirCompra} />&nbsp;
                <FaCheck className="text-2xl text-green-600 inline-block cursor-pointer" title="Alterar Status"
                    onClick={alterarStatus} />
            </td>
        </tr>
    )
}
