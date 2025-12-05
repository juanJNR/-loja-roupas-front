import type { MarcaType } from "./MarcaType"

export type ProdutoType = {
    id: number
    nome: string
    descricao?: string
    preco: number
    foto?: string
    tamanhos?: string
    cor?: string
    estoque: number
    destaque: boolean
    createdAt: Date
    updatedAt: Date
    marcaId: number
    marca: MarcaType
    ativo: boolean
}