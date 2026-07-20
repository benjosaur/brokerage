import { Navigate, Route, Routes } from "react-router";
import PublicShell from "./components/PublicShell";
import Shell from "./components/Shell";
import { useSignedIn } from "./lib/store";
import CoordinatorHome from "./pages/CoordinatorHome";
import FindSupport from "./pages/FindSupport";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Results from "./pages/Results";

function Coordinator() {
  const signedIn = useSignedIn();
  if (!signedIn) return <Navigate to="/coordinator/login" replace />;
  return <Shell />;
}

export default function App() {
  const signedIn = useSignedIn();

  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route element={<PublicShell />}>
        <Route path="/find-support" element={<FindSupport />} />
        <Route
          path="/find-support/results/:requestId"
          element={<Results />}
        />
      </Route>
      <Route
        path="/coordinator/login"
        element={signedIn ? <Navigate to="/coordinator" replace /> : <Login />}
      />
      <Route path="/coordinator" element={<Coordinator />}>
        <Route index element={<CoordinatorHome />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
