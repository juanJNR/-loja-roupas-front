import type { ProdutoType } from "./ProdutoType"
import type { ClienteType } from "./ClienteType"

export type CompraType = {
    id: number
    clienteId: string
    produtoId: number
    produto: ProdutoType
    cliente: ClienteType
    quantidade: number
    tamanho?: string
    cor?: string
    valorTotal: number
    status: string
    createdAt: string
    updatedAt: string
}
