import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { useState, useEffect } from "react"
import type { MarcaType } from "../utils/MarcaType"
import { useAdminStore } from "./context/AdminContext"

const apiUrl = import.meta.env.VITE_API_URL

type Inputs = {
    nome: string
    marcaId: number
    preco: number
    estoque: number
    foto: string
    tamanhos: string
    cor: string
    descricao: string
    adminId: string
}

export default function AdminNovoProduto() {
    const [marcas, setMarcas] = useState<MarcaType[]>([])
    const { admin } = useAdminStore()

    const {
        register,
        handleSubmit,
        reset,
        setFocus
    } = useForm<Inputs>()

    useEffect(() => {
        async function getMarcas() {
            const response = await fetch(`${apiUrl}/marcas`)
            const dados = await response.json()
            setMarcas(dados)
        }
        getMarcas()
        setFocus("nome")
    }, [])

    const optionsMarca = marcas.map(marca => (
        <option key={marca.id} value={marca.id}>{marca.nome}</option>
    ))

    // Se não houver marcas, exibir mensagem
    if (marcas.length === 0) {
        optionsMarca.unshift(
            <option key="0" value="">Nenhuma marca cadastrada</option>
        )
    } else {
        optionsMarca.unshift(
            <option key="0" value="">Selecione uma marca</option>
        )
    }

    async function incluirProduto(data: Inputs) {
        const novoProduto: Inputs = {
            nome: data.nome,
            marcaId: Number(data.marcaId),
            preco: Number(data.preco),
            estoque: Number(data.estoque),
            tamanhos: data.tamanhos,
            foto: data.foto,
            cor: data.cor,
            descricao: data.descricao,
            adminId: admin.id
        }

        const response = await fetch(`${apiUrl}/produtos`,
            {
                method: "POST",
                headers: {
                    "Content-type": "application/json",
                    Authorization: `Bearer ${admin.token}`
                },
                body: JSON.stringify(novoProduto)
            },
        )

        if (response.status == 201) {
            toast.success("Ok! Produto cadastrado com sucesso")
            reset()
        } else {
            toast.error("Erro no cadastro do Produto...")
        }
    }

    return (
        <>
            <h1 className="mb-4 mt-24 text-2xl font-bold leading-none tracking-tight text-black md:text-3xl lg:text-4xl me-56 flex items-center gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                </svg>
                Inclusão de Produtos
            </h1>

            <form className="max-w-xl mx-auto" onSubmit={handleSubmit(incluirProduto)}>
                <div className="mb-3">
                    <label htmlFor="nome" className="block mb-2 text-sm font-medium text-black">
                        Nome do Produto</label>
                    <input type="text" id="nome"
                        className="bg-gray-50 border border-gray-300 text-black text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" required
                        {...register("nome")}
                    />
                </div>
                <div className="grid gap-6 mb-3 md:grid-cols-2">
                    <div className="mb-3">
                        <label htmlFor="marcaId" className="block mb-2 text-sm font-medium text-black">
                            Marca</label>
                        <select id="marcaId"
                            className="bg-gray-50 border border-gray-300 text-black text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" required
                            {...register("marcaId")}
                        >
                            {optionsMarca}
                        </select>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="tamanhos" className="block mb-2 text-sm font-medium text-black">
                            Tamanhos Disponíveis</label>
                        <input type="text" id="tamanhos" placeholder="P,M,G,GG"
                            className="bg-gray-50 border border-gray-300 text-black text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" required
                            {...register("tamanhos")}
                        />
                    </div>
                </div>
                <div className="grid gap-6 mb-3 md:grid-cols-2">
                    <div className="mb-3">
                        <label htmlFor="preco" className="block mb-2 text-sm font-medium text-black">
                            Preço R$</label>
                        <input type="number" id="preco" step="0.01"
                            className="bg-gray-50 border border-gray-300 text-black text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" required
                            {...register("preco")}
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="estoque" className="block mb-2 text-sm font-medium text-black">
                            Estoque</label>
                        <input type="number" id="estoque"
                            className="bg-gray-50 border border-gray-300 text-black text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" required
                            {...register("estoque")}
                        />
                    </div>
                </div>
                <div className="grid gap-6 mb-3 md:grid-cols-2">
                    <div className="mb-3">
                        <label htmlFor="foto" className="block mb-2 text-sm font-medium text-black">
                            URL da Foto</label>
                        <input type="text" id="foto"
                            className="bg-gray-50 border border-gray-300 text-black text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                            {...register("foto")}
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="cor" className="block mb-2 text-sm font-medium text-black">
                            Cor</label>
                        <input type="text" id="cor"
                            className="bg-gray-50 border border-gray-300 text-black text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" required
                            {...register("cor")}
                        />
                    </div>
                </div>
                <div className="mb-3">
                    <label htmlFor="descricao" className="block mb-2 text-sm font-medium text-black">
                        Descrição</label>
                    <textarea id="descricao" rows={4}
                        className="block p-2.5 w-full text-sm text-black bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                        {...register("descricao")}></textarea>
                </div>

                <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                    Incluir</button>
            </form>
        </>
    )
}