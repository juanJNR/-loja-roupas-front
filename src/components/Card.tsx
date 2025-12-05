import { Link } from "react-router-dom";
import type { ProdutoType } from "../utils/ProdutoType";

type CardProps = {
    data: ProdutoType;
}

export function Card({ data }: CardProps) {
    return (
        <div className="bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
            <Link to={`/detalhes/${data.id}`}>
                <img className="p-4 rounded-t-lg object-contain h-64 w-full bg-gray-50" src={data.foto || "/placeholder.jpg"} alt={data.nome} />
            </Link>
            <div className="px-5 pb-5">
                <Link to={`/detalhes/${data.id}`}>
                    <h5 className="text-xl font-semibold tracking-tight text-gray-900 dark:text-white">
                        {data.marca?.nome ? `${data.marca.nome} - ` : ""}{data.nome}
                    </h5>
                </Link>
                <div className="mt-2.5 mb-5">
                    {data.tamanhos && (
                        <span className="bg-blue-100 text-blue-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300">
                            Tamanhos: {data.tamanhos}
                        </span>
                    )}
                    {data.cor && (
                        <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded dark:bg-green-900 dark:text-green-300">
                            {data.cor}
                        </span>
                    )}
                </div>
                <div className="flex items-center justify-between">
                    <span className="text-3xl font-bold text-gray-900 dark:text-white">
                        R$ {Number(data.preco).toLocaleString("pt-br", { minimumFractionDigits: 2 })}
                    </span>
                    <div className="inline-flex gap-2">
                        {data.estoque > 0 ? (
                            <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded dark:bg-green-900 dark:text-green-300">
                                Em estoque: {data.estoque}
                            </span>
                        ) : (
                            <span className="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded dark:bg-red-900 dark:text-red-300">
                                Fora de estoque
                            </span>
                        )}
                        {data.destaque && (
                            <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5 py-0.5 rounded dark:bg-yellow-900 dark:text-yellow-300">
                                ⭐ Destaque
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}