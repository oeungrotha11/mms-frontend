import React, { useState } from 'react'
import { BrowserRouter, Outlet, Route, Routes, useLocation } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import Home from './pages/user/Home'
import './index.css';

import Movies from './pages/admin/Movies'
import Dashboard from './pages/admin/Dashboard'
import Sidebar from './components/admincomponents/Sidebar';
import Topbar from './components/admincomponents/Topbar';
import AddMovie from './pages/admin/AddMovie';
import Categories from './pages/admin/Categories';
import Users from './pages/admin/Users';
import User from './pages/user/User';
import Reviews from './pages/admin/Reviews';
import Subscriptions from './pages/admin/Subscriptions';
import Payments from './pages/admin/Payments';
import Plans from './pages/admin/Plans';
import WatchHistory from './pages/admin/WatchHistory';
import AdminRoute from './routes/AdminRoute'
import AuthRoute from './routes/AuthRoute'
import WatchMovies from './pages/user/WatchMovies'
import MovieDetail from './pages/user/MovieDetail'

function App() {

  function AuthLayout() {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <Outlet />
      </div>
    );
  }

  const pageTitles = {
    "/admin/dashboard": "Dashboard",
    "/admin/movies": "Movies",
    "/admin/add-movie": "Add Movie",
    "/admin/categories": "Categories",
    "/admin/users": "Users",
    "/admin/reviews": "Reviews",
    "/admin/subscriptions": "Subscriptions",
    "/admin/payments": "Payments",
    "/admin/plans": "Plans",
    "/admin/watch-history": "Watch History"
  };

  function AdminLayout() {
    const location = useLocation();

    return (
      <>
        <Sidebar />

        <main className="main">
          <Topbar title={pageTitles[location.pathname] || "Admin"} />

          <div className="content">
            <Outlet />
          </div>
        </main>
      </>
    );
  }

  return (

    <>
      {/* <Sidebar activePage={activePage} onNavigate={navigate} />
      <main className="main">
        <Topbar title={pageTitles[activePage] || activePage} />
        <div className="content">
          {renderPage()}
        </div>
      </main> */}


      <BrowserRouter>
        <Routes>

          {/* AUTH ROUTES */}
          {/* <Route element={<AuthRoute />}> */}
            <Route element={<AuthLayout />}>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
            </Route>
          {/* </Route> */}

          {/* ADMIN ROUTES */}
          <Route element={<AdminRoute />}>
            <Route path="/admin" element={<AdminLayout />}>
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="movies" element={<Movies />} />
              <Route path="add-movie" element={<AddMovie />} />
              <Route path="categories" element={<Categories />} />
              <Route path="users" element={<Users />} />
              <Route path="reviews" element={<Reviews />} />
              <Route path="subscriptions" element={<Subscriptions />} />
              <Route path="payments" element={<Payments />} />
              <Route path="plans" element={<Plans />} />
              <Route path="watch-history" element={<WatchHistory />} />
            </Route>
          </Route>

          {/* USER ROUTE (later expand) */}
          <Route path="/" element={<Home />} />
          <Route path="/user" element={<User />} />
          <Route path="/watchMovies" element={<WatchMovies />} />
          <Route path="/movies/:id" element={<MovieDetail />} />

        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
