import { Navigate, Route, Routes } from "react-router";
import Shell from "./components/Shell";
import { useSignedIn } from "./lib/store";
import Home from "./pages/Home";
import Login from "./pages/Login";

export default function App() {
  const signedIn = useSignedIn();

  if (!signedIn) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  return (
    <Routes>
      <Route path="/login" element={<Navigate to="/" replace />} />
      <Route element={<Shell />}>
        <Route path="/" element={<Home />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
