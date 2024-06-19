
import { BrowserRouter, Routes, Route } from "react-router-dom";
import './App.css';
import Home from './pages/home';
import Layout from "./pages/layout";
function App() {
  return (
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<Layout children={
        <Home />
      
      } />}>
        <Route index element={<Home />} />
      </Route>
    </Routes>
  </BrowserRouter>
  );
}

export default App;
