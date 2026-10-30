import React from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import HomePage from "./components/pages/HomePage";

import FanBrushesPage from "./components/pages/brushes-pages/FanBrushesPage";
import RoundBrushesPage from "./components/pages/brushes-pages/RoundBrushesPage";
import FlatBrushesPage from "./components/pages/brushes-pages/FlatBrushesPage";

import AcrylicPaintPage from "./components/pages/paint-pages/AcrylicPaintPage";
import OilPaintPage from "./components/pages/paint-pages/OilPaintPage";
import WatercolorPaintPage from "./components/pages/paint-pages/WatercolorPaintPage";

import WatercolorPaperPage from "./components/pages/paper-pages/WatercolorPaperPage";
import DrawingPaperPage from "./components/pages/paper-pages/DrawingPaperPage";
import CanvasPaperPage from "./components/pages/paper-pages/CanvasPaperPage";

import GraphitePencilsPage from "./components/pages/pencils-pages/GraphitePencilsPage";
import ColoredPencilsPage from "./components/pages/pencils-pages/ColoredPencilsPage";
import CharcoalPencilsPage from "./components/pages/pencils-pages/CharcoalPencilsPage";

import CheckoutPage from "./components/pages/CheckoutPage";
import ConfirmedPage from "./components/pages/ConfirmedPage";
import { AuthProvider } from "./components/AuthContext";
import { CartProvider } from "./components/CartContext";
// import 'bootstrap/dist/css/bootstrap.min.css';

const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <div className="App wrapper mx-auto flex min-h-screen max-w-[1200px] flex-col">
            <header>
              <Header />
            </header>

            <main className="grow px-5">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/checkout-page" element={<CheckoutPage />} />
                <Route path="/confirmed-page" element={<ConfirmedPage />} />

                <Route path="/fan-brushes" element={<FanBrushesPage />} />
                <Route path="/round-brushes" element={<RoundBrushesPage />} />
                <Route path="/flat-brushes" element={<FlatBrushesPage />} />

                <Route path="/acrylic-paint" element={<AcrylicPaintPage />} />
                <Route path="/oil-paint" element={<OilPaintPage />} />
                <Route
                  path="/watercolor-paint"
                  element={<WatercolorPaintPage />}
                />

                <Route
                  path="/watercolor-paper"
                  element={<WatercolorPaperPage />}
                />
                <Route path="/drawing-paper" element={<DrawingPaperPage />} />
                <Route path="/canvas-paper" element={<CanvasPaperPage />} />

                <Route
                  path="/graphite-pencils"
                  element={<GraphitePencilsPage />}
                />
                <Route
                  path="/colored-pencils"
                  element={<ColoredPencilsPage />}
                />
                <Route
                  path="/charcoal-pencils"
                  element={<CharcoalPencilsPage />}
                />
              </Routes>
            </main>

            <footer>
              <Footer />
            </footer>
          </div>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
