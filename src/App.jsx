import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import ProjectsPage from "./pages/ProjectsPage";
import EnviarDepoimento from "./pages/EnviarDepoimento";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/projetos" element={<ProjectsPage />} />
      <Route path="/enviar-depoimento" element={<EnviarDepoimento />} />
    </Routes>
  );
}
