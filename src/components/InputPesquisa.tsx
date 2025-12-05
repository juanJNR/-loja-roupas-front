import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { ProdutoType } from "../utils/ProdutoType";

const apiUrl = import.meta.env.VITE_API_URL

type Inputs = {
    termo: string
}

type InputPesquisaProps = {
    setProdutos: React.Dispatch<React.SetStateAction<ProdutoType[]>>
}

export function InputPesquisa({ setProdutos }: InputPesquisaProps) {
    const { register, handleSubmit, reset } = useForm<Inputs>()

    async function enviaPesquisa(data: Inputs) {
        if (data.termo.length < 2) {
            toast.error("Informe, no mínimo, 2 caracteres")
            return
        }

        const response = await fetch(`${apiUrl}/produtos/pesquisa/${encodeURIComponent(data.termo)}`)
        const dados = await response.json()
        setProdutos(dados)
    }

    async function mostraDestaques() {
        const response = await fetch(`${apiUrl}/produtos/destaques`)
        const dados = await response.json()
        reset({ termo: "" })
        setProdutos(dados)
    }

    async function mostraUltimos() {
        const response = await fetch(`${apiUrl}/produtos/ultimos`)
        const dados = await response.json()
        setProdutos(dados)
    }

    async function mostraTop() {
        const response = await fetch(`${apiUrl}/produtos/topavaliados`)
        if (response.status === 200) {
            const dados = await response.json()
            const itens = dados.map((r: any) => r.produto ? r.produto : r)
            setProdutos(itens)
            return
        }
        mostraDestaques()
    }

    return (
        <div className="flex mx-auto max-w-5xl mt-3">
            <form className="flex-1" onSubmit={handleSubmit(enviaPesquisa)}>
                <label htmlFor="default-search" className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Search</label>
                <div className="relative">
                    <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                        <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                        </svg>
                    </div>
                    <input type="search" id="default-search" className="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        placeholder="Busque por nome, marca ou preço máximo" required
                        {...register('termo')} />
                    <button type="submit" className="text-white absolute end-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                        Pesquisar
                    </button>
                </div>
            </form>
            <div className="ms-3 mt-2 flex gap-2">
                <button type="button" className="focus:outline-none text-white bg-purple-700 hover:bg-purple-800 focus:ring-4 focus:ring-purple-300 font-medium rounded-lg text-sm px-4 py-2.5 mb-2 dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-900"
                    onClick={mostraDestaques}>
                    Destaques
                </button>
                <button type="button" className="focus:outline-none text-white bg-green-600 hover:bg-green-700 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-4 py-2.5 mb-2 dark:bg-green-500 dark:hover:bg-green-600 dark:focus:ring-green-900"
                    onClick={mostraUltimos}>
                    Últimos
                </button>
                <button type="button" className="focus:outline-none text-white bg-yellow-600 hover:bg-yellow-700 focus:ring-4 focus:ring-yellow-300 font-medium rounded-lg text-sm px-4 py-2.5 mb-2 dark:bg-yellow-500 dark:hover:bg-yellow-600 dark:focus:ring-yellow-900"
                    onClick={mostraTop}>
                    Top
                </button>
            </div>
        </div>
    )
}