import { Navigate, Route, Routes } from "react-router";
import PublicShell from "./components/PublicShell";
import Shell from "./components/Shell";
import { useSignedIn } from "./lib/store";
import Clients from "./pages/Clients";
import Compliance from "./pages/Compliance";
import CoordinatorHome from "./pages/CoordinatorHome";
import FindSupport from "./pages/FindSupport";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Providers from "./pages/Providers";
import Results from "./pages/Results";
import Volunteers from "./pages/Volunteers";

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
        <Route path="providers" element={<Providers />} />
        <Route path="clients" element={<Clients />} />
        <Route path="volunteers" element={<Volunteers />} />
        <Route path="compliance" element={<Compliance />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
