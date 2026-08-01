import { BrowserRouter, Routes, Route } from "react-router-dom";

import MainLayout from "../components/MainLayout/MainLayout";
import Home from "../pages/Home/Home";
import News from "../pages/News/News";
import Releases from "../pages/Releases/Releases";
import Reviews from "../pages/Reviews/Reviews";
import Guides from "../pages/Guides/Guides";
import Brands from "../pages/Brands/Brands";
import Deals from "../pages/Deals/Deals";
import Calendar from "../pages/Calendar/Calendar";
import Login from "../pages/Login/Login";
import Signup from "../pages/Signup/Signup";
import About from "../pages/About/About";
import Contact from "../pages/Contact/Contact";
import NotFound from "../pages/NotFound/NotFound";
import Article from "../pages/Article/Article";
import PublicProfile from "../pages/Profile/Profile";
import Search from "../pages/Search/Search";
import ContentDetail from "../pages/ContentDetail/ContentDetail";
import { AdminProvider } from "../admin/context/AdminContext";
import { ToastProvider } from "../admin/components/Toast";
import AdminLayout, { RequireAdmin } from "../admin/components/AdminLayout";
import AdminLogin from "../admin/Login/AdminLogin";
import Dashboard from "../admin/Dashboard/Dashboard";
import Articles from "../admin/Articles/Articles";
import Categories from "../admin/Categories/Categories";
import Users from "../admin/Users/Users";
import Profile from "../admin/Settings/Profile";
import AdminHome from "../admin/Home/Home";
import AdminReleases from "../admin/Releases/Releases";
import AdminReviews from "../admin/Reviews/Reviews";
import AdminBrands from "../admin/Brands/Brands";
import AdminGuides from "../admin/BuyingGuides/BuyingGuides";
import AdminDeals from "../admin/Deals/Deals";
import AdminCalendar from "../admin/ReleaseCalendar/ReleaseCalendar";
import Authors from "../admin/Authors/Authors";
import MediaLibrary from "../admin/MediaLibrary/MediaLibrary";
import Newsletter from "../admin/Newsletter/Newsletter";
import Settings from "../admin/Settings/Settings";
import HeroSlides from "../admin/HeroSlides/HeroSlides";

function AppRouter() {
  return (
    <BrowserRouter>
      <AdminProvider>
      <ToastProvider>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/news" element={<News />} />
          <Route path="/releases" element={<Releases />} />
          <Route path="/reviews" element={<Reviews />} />
          <Route path="/guides" element={<Guides />} />
          <Route path="/brands" element={<Brands />} />
          <Route path="/deals" element={<Deals />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/search" element={<Search />} />
        </Route>
     <Route path="/article/:id" element={<Article />} />
        <Route path="/release/:id" element={<ContentDetail type="release" back="/releases" />} />
        <Route path="/review/:id" element={<ContentDetail type="review" back="/reviews" />} />
        <Route path="/brand/:id" element={<ContentDetail type="brand" back="/brands" />} />
        <Route path="/guide/:id" element={<ContentDetail type="guide" back="/guides" />} />
        <Route path="/calendar/:id" element={<ContentDetail type="calendar" back="/calendar" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/profile" element={<PublicProfile />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route element={<RequireAdmin />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="home" element={<AdminHome />} />
            <Route path="home/hero" element={<AdminHome activeSection="hero" />} />
            <Route path="home/featured-news" element={<AdminHome activeSection="news" />} />
            <Route path="home/featured-releases" element={<AdminHome activeSection="releases" />} />
            <Route path="home/trending" element={<AdminHome activeSection="trending" />} />
            <Route path="home/brands" element={<AdminHome activeSection="brands" />} />
            <Route path="home/newsletter" element={<AdminHome activeSection="newsletter" />} />
            <Route path="home/seo" element={<AdminHome activeSection="seo" />} />
            <Route path="home/hero-slides" element={<HeroSlides />} />
            <Route path="hero-slides" element={<HeroSlides />} />
            <Route path="articles" element={<Articles />} />
            <Route path="releases" element={<AdminReleases />} />
            <Route path="reviews" element={<AdminReviews />} />
            <Route path="brands" element={<AdminBrands />} />
            <Route path="guides" element={<AdminGuides />} />
            <Route path="deals" element={<AdminDeals />} />
            <Route path="calendar" element={<AdminCalendar />} />
            <Route path="categories" element={<Categories />} />
            <Route path="authors" element={<Authors />} />
            <Route path="users" element={<Users />} />
            <Route path="media" element={<MediaLibrary />} />
            <Route path="newsletter" element={<Newsletter />} />
            <Route path="settings" element={<Settings />} />
            <Route path="profile" element={<Profile />} />
          </Route>
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
      </ToastProvider>
      </AdminProvider>
    </BrowserRouter>
  );
}

export default AppRouter;
