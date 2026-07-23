import { Navigate, Route, Routes } from "react-router";
import PublicShell from "./components/PublicShell";
import Shell from "./components/Shell";
import { Toaster } from "./components/Toaster";
import ClientForm from "./pages/ClientForm";
import Clients from "./pages/Clients";
import CoordinatorHome from "./pages/CoordinatorHome";
import Dbs from "./pages/Dbs";
import FindSupport from "./pages/FindSupport";
import Landing from "./pages/Landing";
import ProviderForm from "./pages/ProviderForm";
import Providers from "./pages/Providers";
import PublicLiability from "./pages/PublicLiability";
import Records from "./pages/Records";
import Results from "./pages/Results";
import VolunteerForm from "./pages/VolunteerForm";
import Volunteers from "./pages/Volunteers";

export default function App() {
  return (
    <>
      <Toaster />
      <Routes>
        <Route path="/" element={<Landing />} />
        {/* The questionnaire renders chromeless: no ribbon or app header. */}
        <Route path="/find-support" element={<FindSupport />} />
        <Route element={<PublicShell />}>
          <Route
            path="/find-support/results/:requestId"
            element={<Results />}
          />
        </Route>
        <Route path="/coordinator" element={<Shell />}>
          <Route index element={<CoordinatorHome />} />
          <Route path="clients" element={<Clients />} />
          <Route path="clients/create" element={<ClientForm />} />
          <Route path="clients/edit/:id" element={<ClientForm />} />
          <Route path="providers" element={<Providers />} />
          <Route path="providers/create" element={<ProviderForm />} />
          <Route path="providers/edit/:id" element={<ProviderForm />} />
          <Route path="volunteers" element={<Volunteers />} />
          <Route path="volunteers/create" element={<VolunteerForm />} />
          <Route path="volunteers/edit/:id" element={<VolunteerForm />} />
          <Route path="dbs" element={<Dbs />} />
          <Route path="public-liability" element={<PublicLiability />} />
          <Route path="records" element={<Records />} />
          <Route
            path="compliance"
            element={<Navigate to="/coordinator/dbs" replace />}
          />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}
