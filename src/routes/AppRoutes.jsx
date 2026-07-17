import { createBrowserRouter } from "react-router-dom";
import { lazy } from "react";

import PublicRoute from "./PublicRoute.jsx";
import ProtectedRoute from "./ProtectedRoute.jsx";

import ErrorPage from "../components/Error.jsx";
import Customuse from "../pages/adminPages/Customuse.jsx";


// Auth
const Login = lazy(() => import("../pages/loginpage/login.jsx"));
const Register = lazy(() => import("../pages/loginpage/register.jsx"));


// Admin
const Layout = lazy(() => import("../pages/adminPages/Layout.jsx"));
const Dashboard = lazy(() => import("../pages/adminPages/Dashboard.jsx"));
const ProductsAdmin = lazy(() => import("../pages/adminPages/Products.jsx"));
const NotificationsAdmin = lazy(() => import("../pages/adminPages/Notifications.jsx"));
const Add = lazy(() => import("../pages/adminPages/Add.jsx"));
const Orders = lazy(() => import("../pages/adminPages/Orders.jsx"));
const Users = lazy(() => import("../pages/adminPages/Users.jsx"));
const OrderDetails = lazy(() => import("../pages/adminPages/OrderDetails.jsx"));

// User
const LayoutUser = lazy(() => import("../pages/userPages/Layout.jsx"));
const Home = lazy(() => import("../pages/userPages/Home.jsx"));
const Chackout = lazy(() => import("../pages/userPages/Checkout.jsx"));
const Favorites = lazy(() => import("../pages/userPages/Favorites.jsx"));
const Products = lazy(() => import("../pages/userPages/Products"));
const Cart = lazy(() => import("../pages/userPages/Cart.jsx"));
const OrderTracking = lazy(() => import("../pages/userPages/OrderTracking.jsx"));
const Offers = lazy(() => import("../pages/userPages/Offer.jsx"));


export const AppRoutes = createBrowserRouter([
  {
    path: "/login",
    element: (
      <PublicRoute >
        <Login />
      </PublicRoute >
    ),
  },
  {
    path: "/register",
    element: (
      <PublicRoute >
        <Register />
      </PublicRoute>
    ),
  },
  {
    path: "/admin",
    element: (
      <ProtectedRoute >
        <Layout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <Dashboard />,
      },
      {
        path: "Products",
        element: <ProductsAdmin />,
      },
      {
        path: "Products/add",
        element: <Add />,
      },
      {
        path: "orders",
        element: <Orders />,
      },
      {
        path: "orders/:id",
        element: <OrderDetails />,
      },
      {
        path: "customuse",
        element: <Customuse />,
      },
      {
        path: "users",
        element: <Users />,
      },
      {
        path: "notificationsAdmin",
        element: <NotificationsAdmin />,
      },
    ],
  },
  {
    path: "/",
    element: <LayoutUser />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "Products",
        element: <Products />,
      },
      {
        path: "Offers",
        element: <Offers />,
      },
      {
        path: "cart",
        element: <Cart />,
      },
      {
        path: "checkout",
        element: <Chackout />,
      },
      {
        path: "favorites",
        element: <Favorites />,
      },
      {
        path: "orders",
        element: <OrderTracking />,
      },
    ],
  },

  {
    path: "*",
    element: <ErrorPage />,
  },

  {
    path: "*",
    element: <ErrorPage />,
  },
]);