import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./pages/layout";
import Home from "./pages/home";
import Login from "./pages/login";
import Register from "./pages/register";
import Protected from "./pages/protected";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route
            index
            element={
              <Protected>
                <Home />
              </Protected>
            }
          />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="*" element={<h1>404 no such page</h1>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
