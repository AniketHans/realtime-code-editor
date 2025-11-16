import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import EditorPage from "./pages/EditorPage";
import "./App.css";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />}></Route>
      <Route path="/editor/:roomId" element={<EditorPage />}></Route>
    </Routes>
  );
}

export default App;
