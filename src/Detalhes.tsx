import type { ProdutoType } from "./utils/ProdutoType"
import { useParams } from "react-router-dom"
import { useEffect, useState } from "react"
import { useClienteStore } from "./context/ClienteContext"
import { useForm } from "react-hook-form"
import { toast } from 'sonner'

const apiUrl = import.meta.env.VITE_API_URL

type Inputs = {
  quantidade: number
  tamanho: string
  cor: string
}

type AvaliacaoInput = {
  nota: number
  comentario: string
}

export default function Detalhes() {
  const params = useParams()

  const [produto, setProduto] = useState<ProdutoType>()
  const { cliente } = useClienteStore()
  const [avaliacoes, setAvaliacoes] = useState<any[]>([])
  const [media, setMedia] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)
  const [compraConcluida, setCompraConcluida] = useState(false)

  const { register, handleSubmit, reset } = useForm<Inputs>()
  const { register: registerAvaliacao, handleSubmit: handleSubmitAvaliacao, reset: resetAvaliacao } = useForm<AvaliacaoInput>()

  useEffect(() => {
    async function buscaDados() {
      const response = await fetch(`${apiUrl}/produtos/${params.produtoId}`)
      const dados = await response.json()
      if (dados.produto) {
        setProduto(dados.produto)
        setAvaliacoes(dados.avaliacoes || [])
        setMedia(dados.media ?? null)
      } else {
        setProduto(dados)
      }
    }
    buscaDados()
  }, [])

  async function realizarCompra(data: Inputs) {
    if (!produto) return

    const valorTotal = Number(produto.preco) * data.quantidade

    const dadosCompra = {
      clienteId: cliente.id,
      produtoId: Number(params.produtoId),
      quantidade: Number(data.quantidade),
      tamanho: data.tamanho || "",
      cor: data.cor || "",
      valorTotal: valorTotal
    }

    console.log('=== ENVIANDO COMPRA ===')
    console.log('Dados:', dadosCompra)

    setLoading(true)

    // Simula processamento de 5 segundos
    setTimeout(async () => {
      try {
        const response = await fetch(`${apiUrl}/compras`, {
          headers: {
            "Content-Type": "application/json"
          },
          method: "POST",
          body: JSON.stringify(dadosCompra)
        })

        setLoading(false)

        if (response.status == 201) {
          setCompraConcluida(true)
          toast.success("Compra realizada com sucesso!")
          reset()
        } else {
          const erro = await response.json()
          console.error('Erro ao comprar:', erro)
          toast.error("Erro... Não foi possível realizar a compra")
        }
      } catch (error) {
        setLoading(false)
        console.error('Erro na requisição:', error)
        toast.error("Erro de conexão ao realizar compra")
      }
    }, 5000)
  }

  async function enviaAvaliacao(data: AvaliacaoInput) {
    if (!cliente.id) {
      toast.error('Faça login para avaliar')
      return
    }

    const response = await fetch(`${apiUrl}/produtos/${params.produtoId}/avaliar`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        clienteId: cliente.id,
        nota: Number(data.nota),
        comentario: data.comentario
      })
    })

    if (response.ok) {
      toast.success('Avaliação enviada com sucesso!')
      resetAvaliacao()
      // Recarrega as avaliações
      const r = await fetch(`${apiUrl}/produtos/${params.produtoId}`)
      if (r.ok) {
        const novo = await r.json()
        if (novo.avaliacoes) setAvaliacoes(novo.avaliacoes)
        if (novo.media !== undefined) setMedia(novo.media)
      }
      setCompraConcluida(false)
    } else {
      toast.error('Erro ao enviar avaliação')
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-700"></div>
      </div>
    )
  }

  return (
    <>
      <section className="flex mt-6 mx-auto flex-col items-center bg-white border border-gray-200 rounded-lg shadow md:flex-row md:max-w-5xl hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700">
        <div className="md:w-2/4 flex items-center justify-center bg-gray-50 rounded-t-lg md:rounded-none md:rounded-s-lg">
          <img className="object-contain w-full h-96 p-4"
            src={produto?.foto || "https://via.placeholder.com/400x400?text=Sem+Imagem"} alt="Foto do Produto" />
        </div>
        <div className="flex flex-col justify-between p-4 leading-normal">
          <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            {produto?.marca?.nome && `${produto.marca.nome} - `}{produto?.nome}
          </h5>
          <h5 className="mb-2 text-xl tracking-tight text-gray-900 dark:text-white">
            Preço R$: {Number(produto?.preco)
              .toLocaleString("pt-br", { minimumFractionDigits: 2 })}
          </h5>
          {produto?.descricao && (
            <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
              {produto.descricao}
            </p>
          )}
          <div className="flex gap-2 flex-wrap">
            {produto?.tamanhos && (
              <span className="bg-blue-100 text-blue-800 text-sm font-medium px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300">
                Tamanhos: {produto.tamanhos}
              </span>
            )}
            {produto?.cor && (
              <span className="bg-green-100 text-green-800 text-sm font-medium px-2.5 py-0.5 rounded dark:bg-green-900 dark:text-green-300">
                {produto.cor}
              </span>
            )}
            {produto?.estoque > 0 ? (
              <span className="bg-green-100 text-green-800 text-sm font-medium px-2.5 py-0.5 rounded dark:bg-green-900 dark:text-green-300">
                Em estoque: {produto.estoque}
              </span>
            ) : (
              <span className="bg-red-100 text-red-800 text-sm font-medium px-2.5 py-0.5 rounded dark:bg-red-900 dark:text-red-300">
                Fora de estoque
              </span>
            )}
          </div>
          {cliente.id && !compraConcluida ?
            <>
              <h3 className="mt-4 text-xl font-bold tracking-tight text-gray-900 dark:text-white">
                🛒 Realizar Compra
              </h3>
              <form onSubmit={handleSubmit(realizarCompra)}>
                <input type="text" className="mb-2 mt-4 bg-gray-100 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 cursor-not-allowed dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500" value={`${cliente.nome} (${cliente.email})`} disabled readOnly />

                <div className="mb-2">
                  <label className="block mb-1 text-sm font-medium text-gray-900 dark:text-white">Quantidade</label>
                  <input type="number" min="1" max={produto?.estoque} defaultValue={1}
                    className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    required
                    {...register("quantidade")} />
                </div>

                <div className="mb-2">
                  <label className="block mb-1 text-sm font-medium text-gray-900 dark:text-white">Tamanho</label>
                  <input type="text" placeholder="Ex: M, G, GG"
                    className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    required
                    {...register("tamanho")} />
                </div>

                <div className="mb-2">
                  <label className="block mb-1 text-sm font-medium text-gray-900 dark:text-white">Cor</label>
                  <input type="text" placeholder="Ex: Azul, Vermelho"
                    className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    {...register("cor")} />
                </div>

                <button type="submit" className="mt-2 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                  Comprar Agora
                </button>
              </form>
            </>
            : !cliente.id ?
              <h2 className="mt-4 mb-2 text-xl tracking-tight text-gray-900 dark:text-white">
                😎 Gostou? Identifique-se para comprar!
              </h2>
              : null
          }

          {compraConcluida && (
            <div className="mt-6 p-4 bg-green-100 rounded-lg dark:bg-green-900">
              <h3 className="text-lg font-bold text-green-800 dark:text-green-200">
                ✅ Compra realizada com sucesso!
              </h3>
              <p className="mt-2 text-sm text-green-700 dark:text-green-300">
                Agora você pode avaliar este produto
              </p>

              <h4 className="mt-4 font-semibold text-green-800 dark:text-green-200">Avaliar produto</h4>
              <form onSubmit={handleSubmitAvaliacao(enviaAvaliacao)} className="mt-2">
                <select {...registerAvaliacao("nota", { valueAsNumber: true })} defaultValue={5} className="block p-2 mb-2 rounded border bg-white dark:bg-gray-700">
                  <option value={5}>⭐⭐⭐⭐⭐ (5)</option>
                  <option value={4}>⭐⭐⭐⭐ (4)</option>
                  <option value={3}>⭐⭐⭐ (3)</option>
                  <option value={2}>⭐⭐ (2)</option>
                  <option value={1}>⭐ (1)</option>
                </select>
                <textarea {...registerAvaliacao("comentario")} placeholder="Comentário (opcional)" className="w-full p-2 mb-2 rounded border" rows={3} />
                <button type="submit" className="text-white bg-amber-600 hover:bg-amber-700 px-4 py-2 rounded">
                  Enviar avaliação
                </button>
              </form>
            </div>
          )}

          <div className="mt-6">
            <h3 className="text-lg font-bold">Avaliações {media ? `- média: ${Number(media).toFixed(1)} ⭐` : ''}</h3>
            <div className="space-y-2 mt-2">
              {avaliacoes.length === 0 && <p className="text-gray-500">Nenhuma avaliação ainda.</p>}
              {avaliacoes.map((a, idx) => (
                <div key={idx} className="p-3 border rounded bg-gray-50 dark:bg-gray-700">
                  <div className="flex items-center gap-2">
                    <strong className="text-gray-900 dark:text-white">{a.cliente_nome ?? a.clienteId}</strong>
                    <span className="text-yellow-500">{"⭐".repeat(a.nota)}</span>
                  </div>
                  {a.comentario && <p className="mt-1 text-gray-700 dark:text-gray-300">{a.comentario}</p>}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}