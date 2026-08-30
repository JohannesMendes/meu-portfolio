import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import ProjectsPage from "./pages/ProjectsPage";
import EnviarDepoimento from "./pages/EnviarDepoimento";
import Footer from "./components/Footer";

export default function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/projetos" element={<ProjectsPage />} />
        <Route path="/enviar-depoimento" element={<EnviarDepoimento />} />
      </Routes>
      {/* Rendered once here, OUTSIDE <Routes> — react-router unmounts and
          remounts whichever page element matches the current route on
          every navigation, which was resetting the music player (and
          restarting the track) every time you changed page. Footer (and
          the MusicPlayer inside it) now lives at this level instead, so
          it's a true singleton that survives route changes. */}
      <Footer />
    </>
  );
}
