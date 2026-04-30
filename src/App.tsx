import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// @ts-ignore
import Landing from "./pages/landing";
// @ts-ignore
import Onboarding from "./pages/onboarding";
//@ts-ignore
import Dashboard from "./pages/dashboard";
// @ts-ignore
import Projection from "./pages/projection";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/projection" element={<Projection />} />
      </Routes>
    </Router>
  );
}

export default App;