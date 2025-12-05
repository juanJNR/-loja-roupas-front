import { TiDeleteOutline } from "react-icons/ti"
import { FaRegStar, FaStar } from "react-icons/fa"
import type { ProdutoType } from "../../utils/ProdutoType"
import { useAdminStore } from "../context/AdminContext"

type ItemProps = {
    produto: ProdutoType;
    produtos: ProdutoType[];
    setProdutos: React.Dispatch<React.SetStateAction<ProdutoType[]>>;
}

const apiUrl = import.meta.env.VITE_API_URL

export default function Item({ produto, produtos, setProdutos }: ItemProps) {
    const { admin } = useAdminStore()

    async function excluirProduto() {
        if (!admin || admin.nivel == 1) {
            alert("Você não tem permissão para excluir produtos");
            return;
        }

        if (confirm(`Confirma a exclusão de "${produto.nome}"?`)) {
            const response = await fetch(`${apiUrl}/produtos/${produto.id}`,
                {
                    method: "DELETE",
                    headers: {
                        "Content-type": "application/json",
                        Authorization: `Bearer ${admin.token}`
                    },
                },
            )

            if (response.status == 200) {
                const produtos2 = produtos.filter(x => x.id != produto.id)
                setProdutos(produtos2)
                alert("Produto excluído com sucesso")
            } else {
                alert("Erro... Produto não foi excluído")
            }
        }
    }

    async function alterarDestaque() {
        const response = await fetch(`${apiUrl}/produtos/destacar/${produto.id}`,
            {
                method: "PATCH",
                headers: {
                    "Content-type": "application/json",
                    Authorization: `Bearer ${admin.token}`
                },
            },
        )

        if (response.status == 200) {
            const produtos2 = produtos.map(x => {
                if (x.id == produto.id) {
                    return { ...x, destaque: !x.destaque }
                }
                return x
            })
            setProdutos(produtos2)
        }
    }

    return (
        <tr key={produto.id} className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700">
            <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                <img src={produto.foto || "/placeholder.jpg"} alt={produto.nome}
                    style={{ width: 200 }} />
            </th>
            <td className={`px-6 py-4 ${produto.destaque ? "font-extrabold" : ""}`}>
                {produto.nome}
            </td>
            <td className={`px-6 py-4 ${produto.destaque ? "font-extrabold" : ""}`}>
                {produto.marca.nome}
            </td>
            <td className={`px-6 py-4 ${produto.destaque ? "font-extrabold" : ""}`}>
                R$ {Number(produto.preco).toLocaleString("pt-br", { minimumFractionDigits: 2 })}
            </td>
            <td className={`px-6 py-4 ${produto.destaque ? "font-extrabold" : ""}`}>
                {produto.estoque} un
            </td>
            <td className="px-6 py-4">
                <TiDeleteOutline className="text-3xl text-red-600 inline-block cursor-pointer" title="Excluir"
                    onClick={excluirProduto} />&nbsp;
                {produto.destaque ? (
                    <FaStar className="text-3xl text-yellow-500 inline-block cursor-pointer" title="Remover Destaque"
                        onClick={alterarDestaque} />
                ) : (
                    <FaRegStar className="text-3xl text-gray-400 inline-block cursor-pointer" title="Destacar"
                        onClick={alterarDestaque} />
                )}
            </td>
        </tr>
    )
}