import { createBrowserRouter, Navigate, useLocation } from 'react-router-dom';
import { useMerchAuth } from './context/MerchAuthContext';
import App from './App';
import Dashboard from './components/Dashboard';
import CollectionsList from './components/CollectionsList';
import CollectionPage from './components/CollectionPage';
import HistoryPage from './pages/HistoryPage';
import AccountPage from './pages/AccountPage';
import ActivityPage from './pages/ActivityPage';
import BridgePage from './pages/bridge';
import Login from './pages/merch/Login';
import Signup from './pages/merch/Signup';
import BecomeSeller from './pages/merch/BecomeSeller';
import ProtectedRoute from './components/merch/ProtectedRoute';
import MerchStoreLayout from './components/merch/MerchStoreLayout';
import SellerDashboard from './pages/merch/SellerDashboard';
import AddProduct from './pages/merch/AddProduct';
import Products from './pages/merch/Products';
import EditProduct from './pages/merch/EditProduct';
import MerchSales from './pages/merch/Sales';
import OrdersReceived from './pages/merch/OrdersReceived';
import Settings from './pages/merch/Settings';
import Browse from './pages/merch/Browse';
import ProductDetails from './pages/merch/ProductDetails';
import Cart from './pages/merch/Cart';
import Orders from './pages/merch/Orders';
import Checkout from './pages/merch/Checkout';
import AdminLayout from './components/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminWithdrawals from './pages/admin/AdminWithdrawals';
import AdminSales from './pages/admin/AdminSales';
import AdminSettings from './pages/admin/AdminSettings';
import AdminRefunds from './pages/admin/AdminRefunds';
import StoreVerification from './pages/admin/StoreVerification';
import SellerRefunds from './pages/merch/SellerRefunds';
import Refunds from './pages/merch/Refunds';
import TermsAndConditions from './pages/merch/TermsAndConditions';
import ForgotPassword from './pages/merch/ForgotPassword';
import ResetPassword from './pages/merch/ResetPassword';
import Inbox from './pages/merch/Inbox';
import SellerInbox from './pages/merch/SellerInbox';
import StoresRevenue from './pages/admin/StoresRevenue';
import FeesTracker from './pages/FeesTracker';
import MemeFactory from './pages/MemeFactory';

const ADMIN_WALLET = "0x5828D525fe00902AE22f2270Ac714616651894fF"; // We'll replace this with your actual address

function AdminRoute({ children }) {
  const { isAdmin, loading } = useMerchAuth();
  const location = useLocation();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!isAdmin) {
    return <Navigate to="/merch-store" state={{ from: location }} replace />;
  }

  return children;
}

// Add this new component for conditional inbox rendering
const InboxRouter = () => {
  const { user } = useMerchAuth();
  return user?.isSeller ? <SellerInbox /> : <Inbox />;
};

export const router = createBrowserRouter([
  // Main app routes
  {
    path: '/',
    element: <App />,
    children: [
      {
        index: true,
        element: <Dashboard />,
      },
      {
        path: '/collections',
        element: <CollectionsList />,
      },
      {
        path: '/collection/:symbol',
        element: <CollectionPage />,
      },
      {
        path: '/history',
        element: <HistoryPage />,
      },
      {
        path: '/account',
        element: <AccountPage />,
      },
      {
        path: '/trading',
        element: <ActivityPage />,
      },
      {
        path: '/bridge',
        element: <BridgePage />,
      },
      {
        path: '/feestracker',
        element: <FeesTracker />,
      },
      {
        path: '/memefactory',
        element: <MemeFactory />,
      },
    ],
  },
  // Add redirect for /login
  {
    path: '/login',
    element: <Navigate to="/merch-store/login" replace />
  },
  // Add redirect for /signup
  {
    path: '/signup',
    element: <Navigate to="/merch-store/signup" replace />
  },
  // Merch store routes with their own layout
  {
    path: '/merch-store',
    element: <MerchStoreLayout />,
    children: [
      {
        path: '',
        element: <Browse />
      },
      {
        path: 'product/:id',
        element: <ProductDetails />
      },
      {
        path: 'login',
        element: <Login />,
      },
      {
        path: 'signup',
        element: <Signup />,
      },
      {
        path: 'become-seller',
        element: <BecomeSeller />,
      },
      {
        path: 'cart',
        element: (
          <ProtectedRoute>
            <Cart />
          </ProtectedRoute>
        ),
      },
      {
        path: 'checkout',
        element: (
          <ProtectedRoute>
            <Checkout />
          </ProtectedRoute>
        ),
      },
      {
        path: 'orders',
        element: (
          <ProtectedRoute>
            <Orders />
          </ProtectedRoute>
        ),
      },
      {
        path: 'dashboard',
        element: (
          <ProtectedRoute sellerOnly>
            <SellerDashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: 'products',
        element: (
          <ProtectedRoute sellerOnly>
            <Products />
          </ProtectedRoute>
        ),
      },
      {
        path: 'add-product',
        element: (
          <ProtectedRoute sellerOnly>
            <AddProduct />
          </ProtectedRoute>
        ),
      },
      {
        path: 'edit-product/:id',
        element: (
          <ProtectedRoute sellerOnly>
            <EditProduct />
          </ProtectedRoute>
        ),
      },
      {
        path: 'sales',
        element: (
          <ProtectedRoute sellerOnly>
            <MerchSales />
          </ProtectedRoute>
        ),
      },
      {
        path: 'orders-received',
        element: (
          <ProtectedRoute sellerOnly>
            <OrdersReceived />
          </ProtectedRoute>
        ),
      },
      {
        path: 'my-refunds',
        element: (
          <ProtectedRoute>
            <Refunds />
          </ProtectedRoute>
        ),
      },
      {
        path: 'refunds',
        element: (
          <ProtectedRoute sellerOnly>
            <SellerRefunds />
          </ProtectedRoute>
        ),
      },
      {
        path: 'settings',
        element: (
          <ProtectedRoute>
            <Settings />
          </ProtectedRoute>
        ),
      },
      {
        path: 'terms',
        element: <TermsAndConditions />,
      },
      {
        path: 'forgot-password',
        element: <ForgotPassword />,
      },
      {
        path: 'reset-password',
        element: <ResetPassword />,
      },
      {
        path: 'inbox',
        element: (
          <ProtectedRoute>
            <InboxRouter />
          </ProtectedRoute>
        ),
      },
      {
        path: 'inbox/:conversationId',
        element: (
          <ProtectedRoute>
            <InboxRouter />
          </ProtectedRoute>
        ),
      },
      {
        path: 'seller/inbox',
        element: (
          <ProtectedRoute sellerOnly>
            <SellerInbox />
          </ProtectedRoute>
        ),
      },
      {
        path: 'seller/inbox/:conversationId',
        element: (
          <ProtectedRoute sellerOnly>
            <SellerInbox />
          </ProtectedRoute>
        ),
      },
    ],
  },
  // Admin Routes
  {
    path: '/admin',
    element: <AdminRoute><AdminLayout /></AdminRoute>,
    children: [
      {
        index: true,
        element: <AdminRoute><AdminDashboard /></AdminRoute>,
      },
      {
        path: 'withdrawals',
        element: <AdminRoute><AdminWithdrawals /></AdminRoute>,
      },
      {
        path: 'store-verification',
        element: <AdminRoute><StoreVerification /></AdminRoute>,
      },
      {
        path: 'refunds',
        element: <AdminRoute><AdminRefunds /></AdminRoute>,
      },
      {
        path: 'sales',
        element: <AdminRoute><AdminSales /></AdminRoute>,
      },
      {
        path: 'settings',
        element: <AdminRoute><AdminSettings /></AdminRoute>,
      },
      {
        path: 'stores-revenue',
        element: <StoresRevenue />
      },
    ],
  },
]); 