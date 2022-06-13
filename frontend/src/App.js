import { Route, Routes } from "react-router-dom";
import "./App.css";
import { ErrorBoundary } from "./helpers/error-boundary";
import { ProtectedRoute } from "./helpers/protected-route";
import { Home } from "./pages/home";
import { Logout } from "./pages/home/logout";
import { LoginPage } from "./pages/login/login";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <ErrorBoundary>
                <Home />
              </ErrorBoundary>
            </ProtectedRoute>
          }
        />
        <Route path="/" element={<LoginPage />} />
        <Route path="/logout" element={<Logout />} />
      </Routes>
    </div>
  );
}

export default App;
