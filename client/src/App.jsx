import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home'
import PrivateRoute from './components/ProtectedRoute';
import DashboardLayout from './components/DashboardLayout';
import Login from './pages/Login'
import Expenses from './pages/Expenses'
import Distribution from './pages/Distribution'
import Purchases from './pages/Purchases'
import Merchants from './pages/Merchants';
import Products from './pages/Products';
import DistributionTickets from './pages/DistributionTickets';
import NewDistribution from './pages/NewDistribution';
import './App.css'
import ProductionAndInventory from './pages/ProductionAndInventory';
import Analytics from './pages/Analytics';

function App() {
  return (
      <Router>
        <Routes>
            {/* <Route index  element={<Login />} /> */}
            <Route element={<PrivateRoute allowedRoles={['owner', 'manager', 'staff']} />}>
              <Route path="/" element={<DashboardLayout />}>
                <Route path="home" element={<Home />} />
                <Route path="purchases" element={<Purchases />} />
                <Route path="expenses" element={<Expenses />} />
                <Route path="merchants" element={<Merchants/>} />
                <Route path="production" element={<ProductionAndInventory/>} />
                <Route path="products" element={<Products/>} />
                <Route path="distribution" >
                  <Route path='new' element={<NewDistribution />} />
                  <Route path='tickets' element={<DistributionTickets />} />
                  <Route path='list' element={<Distribution />} />
                </Route>
                <Route path="analytics" element={<Analytics/>} />
              </Route>
            </Route>
          {/* Default Route */}
          <Route path='/login' element={<Login />} />
          {/* <Route path='/unauthorized' element={<UnAuthorized />} /> */}
        </Routes>
      </Router>
  )
}

export default App
