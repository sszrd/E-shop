import React, { ReactElement, FC, Suspense, lazy } from 'react';
import { Navigate, Route, Routes } from "react-router-dom";
import './App.css';
const Buy = lazy(() => import('./pages/buy'));
const Cart = lazy(() => import('./pages/cart'));
const Category = lazy(() => import('./pages/category'));
const Comment = lazy(() => import('./pages/comment'));
const Home = lazy(() => import('./pages/home'));
const Login = lazy(() => import('./pages/login'));
const Register = lazy(() => import('./pages/register'));
const Search = lazy(() => import('./pages/search'));
const User = lazy(() => import('./pages/user'));

const App: FC = (): ReactElement => {
  return (
    <Suspense fallback={<p>等待加载中...</p>}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/category" element={<Category />} />
        <Route path="/login" element={localStorage.getItem("token") ? <Navigate to="/" /> : <Login />} />
        <Route path="/register" element={localStorage.getItem("token") ? <Navigate to="/" /> : <Register />} />
        <Route path="/user" element={localStorage.getItem("token") ? <User /> : <Navigate to="/login" replace/>} />
        <Route path="/search" element={<Search />} />
        <Route path="/buy/:id" element={<Buy />} />
        <Route path="/cart" element={localStorage.getItem("token") ? <Cart /> : <Navigate to="/login" replace/>} />
        <Route path="/comment" element={localStorage.getItem("token") ? <Comment /> : <Navigate to="/login" replace/>} />
        <Route path="*" element={<Home />} />
      </Routes>
    </Suspense>
  );
}

export default App;
