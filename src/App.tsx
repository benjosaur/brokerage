import { Navigate, Route, Routes } from "react-router";
import PublicShell from "./components/PublicShell";
import Shell from "./components/Shell";
import Clients from "./pages/Clients";
import Compliance from "./pages/Compliance";
import CoordinatorHome from "./pages/CoordinatorHome";
import FindSupport from "./pages/FindSupport";
import Landing from "./pages/Landing";
import Providers from "./pages/Providers";
import Results from "./pages/Results";
import Volunteers from "./pages/Volunteers";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      {/* The questionnaire renders chromeless — no ribbon or app header. */}
      <Route path="/find-support" element={<FindSupport />} />
      <Route element={<PublicShell />}>
        <Route
          path="/find-support/results/:requestId"
          element={<Results />}
        />
      </Route>
      <Route path="/coordinator" element={<Shell />}>
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
