import './index.css'
import App from './App.tsx'
import { AuthProvider } from './context/AuthContext.tsx'
import ReactDOM from 'react-dom/client'
import { CartProvider } from './context/CartContext.tsx'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <AuthProvider>
    <CartProvider>
      <App />
    </CartProvider>
  </AuthProvider>
)
