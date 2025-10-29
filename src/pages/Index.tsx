import React, { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import { Layout } from "@/components/Layout";
import Home from "./Home";
import Login from "./Login";
import CategoryPage from "./CategoryPage";
import PostPage from "./PostPage";
import NotFound from "./NotFound";
import { AdminLayout } from "@/components/Admin/Layout";
import Dashboard from "./admin/Dashboard";
import Posts from "./admin/Posts";
import CreatePost from "./admin/CreatePost";
import Categories from "./admin/Categories";
import Users from "./admin/Users";
import SiteSettings from "./admin/SiteSettings";
import { Outlet } from "react-router-dom";
import About from "./About";
import Contact from "./Contact";
import Privacy from "./Privacy";
import Terms from "./Terms";
import Disclaimer from "./Disclaimer";
import AdminComments from "@/pages/admin/Comments";
import PageBuilder from "./admin/PageBuilder";
import CustomPage from "./CustomPage";
import { getPages, Page as CustomPageType } from "@/services/supabaseService";
import SmartDrivers, { SetupProgressPage } from "./SmartDrivers";
import ComMyTV from "./ComMyTV";
import ActivateProgress from "./ActivateProgress";
import ComMyTV1 from "./ComMyTV1";

const Index = () => {
  const [customPages, setCustomPages] = useState<CustomPageType[]>([]);
  useEffect(() => {
    getPages()
      .then(setCustomPages)
      .catch(() => setCustomPages([]));
  }, []);
  return (
    <Routes>
      {/* Public routes with Layout wrapper */}
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="category/:slug" element={<CategoryPage />} />
        <Route path="post/:slug" element={<PostPage />} />
        {/* Dynamically add custom pages */}
        {customPages.map((page) => (
          <Route
            key={page.id}
            path={page.slug.replace(/^\//, "")}
            element={<CustomPage code={page.code} />}
          />
        ))}
      </Route>

      {/* Auth routes - no layout wrapper */}
      <Route path="/login" element={<Login />} />

      {/* Admin routes with AdminLayout wrapper */}
      <Route
        path="/admin"
        element={
          <AdminLayout>
            <Outlet />
          </AdminLayout>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="posts" element={<Posts />} />
        <Route path="posts/create" element={<CreatePost />} />
        <Route path="create-post" element={<CreatePost />} />
        <Route path="edit-post/:id" element={<CreatePost />} />
        <Route path="categories" element={<Categories />} />
        <Route path="users" element={<Users />} />
        <Route path="settings" element={<SiteSettings />} />
        <Route path="comments" element={<AdminComments />} />
        <Route path="page-builder" element={<PageBuilder />} />
      </Route>

      {/* 404 - no layout wrapper */}
      <Route path="*" element={<NotFound />} />

      {/* New routes */}
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/privacy" element={<Privacy />} />
      <Route path="/terms" element={<Terms />} />
      <Route path="/disclaimer" element={<Disclaimer />} />
      <Route path="/smart-drivers" element={<SmartDrivers />} />
      <Route path="/setup" element={<SetupProgressPage />} />
      <Route path="/com-mytv" element={<ComMyTV />} />
      <Route path="/com-mytv1" element={<ComMyTV1 />} />
      <Route path="/activate" element={<ActivateProgress />} />
    </Routes>
  );
};

export default Index;
