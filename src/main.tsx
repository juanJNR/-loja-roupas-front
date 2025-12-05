import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'

import App from './App.tsx'
import Login from './Login.tsx'
import Detalhes from './Detalhes.tsx'
import MinhasCompras from './MinhasCompras.tsx'
import CadCliente from './CadCliente.tsx'

// ----------------- Rotas de Admin
import AdminLayout from './admin/AdminLayout.tsx';
import AdminLogin from './admin/AdminLogin.tsx';
import AdminDashboard from './admin/AdminDashboard.tsx';
import AdminProdutos from './admin/AdminProdutos.tsx';
import AdminNovoProduto from './admin/AdminNovoProduto.tsx';
import AdminCompras from './admin/AdminCompras.tsx';
import AdminClientes from './admin/AdminClientes.tsx';
import AdminCadAdmin from './admin/AdminCadAdmin.tsx';

import Layout from './Layout.tsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'

const rotas = createBrowserRouter([
  {
    path: "/admin/login",
    element: <AdminLogin />,   // rota do form de login sem o Layout da Área Administrativa
  },
  {
    path: "/admin",
    element: <AdminLayout />,  // layout principal do admin com menus e outlet
    children: [
      { index: true, element: <AdminDashboard /> },          // rota /admin
      { path: "produtos", element: <AdminProdutos /> },          // rota /admin/produtos
      { path: "produtos/novo", element: <AdminNovoProduto /> },  // ...
      { path: "clientes", element: <AdminClientes /> },  // rota /admin/clientes
      { path: "compras", element: <AdminCompras /> },  // ...
      { path: "cadAdmin", element: <AdminCadAdmin /> },  // ...
    ],
  },
  {
    path: '/',
    element: <Layout />,         // Layout das páginas do cliente
    children: [
      { index: true, element: <App /> },
      { path: 'login', element: <Login /> },
      { path: 'detalhes/:produtoId', element: <Detalhes /> },
      { path: 'minhasCompras', element: <MinhasCompras /> },
      { path: 'cadCliente', element: <CadCliente /> },
    ],
  },
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={rotas} />
  </StrictMode>,
)