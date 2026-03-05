import { Routes, Route } from "react-router-dom"
import ProtectedRoute from "./routes/ProtectedRoute"
import Navbar from "./components/Navbar"
import Footer from "./components/Footer"



function App() {
  return (
    <>
      <div className="min-h-screen flex flex-col">
        <Navbar />


        <main className="flex-1 justify-center">
          {/* <AppRouter /> */}

        </main>
        {/* <Routes>
        <Route path="/" element="{<Home />}" />
        <Route path="/login" element="{<Login />}" />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
      </Routes> */}
        <Footer />
      </div>
    </>
  )
}

export default App
