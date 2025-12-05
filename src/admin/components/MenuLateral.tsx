import { useAdminStore } from "../context/AdminContext"
import { IoExitOutline } from "react-icons/io5"
import { BiSolidDashboard } from "react-icons/bi"
import { FaUsers } from "react-icons/fa6"
import { BsCashCoin } from "react-icons/bs"
import { FaRegUser, FaShoppingBag } from "react-icons/fa"

import { Link, useNavigate } from "react-router-dom"

export function MenuLateral() {
  const navigate = useNavigate()
  const { admin, deslogaAdmin } = useAdminStore()

  function adminSair() {
    if (confirm("Confirma Saída?")) {
      deslogaAdmin()
      navigate("/", { replace: true })
    }
  }

  return (
    <aside id="default-sidebar" className="fixed mt-24 left-0 z-40 w-64 h-screen transition-transform -translate-x-full sm:translate-x-0" aria-label="Sidebar">
      <div className="h-full px-3 py-4 overflow-y-auto bg-gray-100 border-r border-gray-200">
        <ul className="space-y-2 font-medium">
          <li>
            <Link to="/admin" className="flex items-center p-2 text-gray-700 hover:bg-blue-50 hover:text-blue-700 rounded-lg">
              <span className="h-5 text-2xl">
                <BiSolidDashboard />
              </span>
              <span className="ms-2 mt-1 font-medium">Visão Geral</span>
            </Link>
          </li>
          <li>
            <Link to="/admin/produtos" className="flex items-center p-2 text-gray-700 hover:bg-blue-50 hover:text-blue-700 rounded-lg">
              <span className="h-5 text-2xl">
                <FaShoppingBag />
              </span>
              <span className="ms-2 mt-1 font-medium">Cadastro de Produtos</span>
            </Link>
          </li>
          <li>
            <Link to="/admin/clientes" className="flex items-center p-2 text-gray-700 hover:bg-blue-50 hover:text-blue-700 rounded-lg">
              <span className="h-5 text-2xl">
                <FaUsers />
              </span>
              <span className="ms-2 mt-1 font-medium">Controle de Clientes</span>
            </Link>
          </li>
          <li>
            <Link to="/admin/compras" className="flex items-center p-2 text-gray-700 hover:bg-blue-50 hover:text-blue-700 rounded-lg cursor-pointer">
              <span className="h-5 text-2xl">
                <BsCashCoin />
              </span>
              <span className="ms-2 mt-1 font-medium">Controle de Compras</span>
            </Link>
          </li>
          {admin.nivel == 3 &&
            <li>
              <Link to="/admin/cadAdmin" className="flex items-center p-2 text-gray-700 hover:bg-blue-50 hover:text-blue-700 rounded-lg cursor-pointer">
                <span className="h-5 text-2xl">
                  <FaRegUser />
                </span>
                <span className="ms-2 mt-1 font-medium">Cadastro de Admins</span>
              </Link>
            </li>
          }
          <li>
            <span className="flex items-center p-2 text-gray-700 hover:bg-red-50 hover:text-red-700 rounded-lg cursor-pointer">
              <span className="h-5 text-2xl">
                <IoExitOutline />
              </span>
              <span className="ms-2 mt-1 font-medium" onClick={adminSair}>Sair do Sistema</span>
            </span>
          </li>
        </ul>
      </div>
    </aside>
  )
}