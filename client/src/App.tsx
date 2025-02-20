import { Routes, Route } from "react-router-dom";

import Dashboard from './pages/Dashboard';
import Form from "./pages/Form";

function App() {
  return (
    <>
      <Routes>
        <Route path='/' element={<Dashboard />} />
        <Route path='/form' element={<Form />} />
      </Routes>
    </>
  )
}

export default App
