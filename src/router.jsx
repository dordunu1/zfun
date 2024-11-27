import { createBrowserRouter } from 'react-router-dom';
import App from './App';
import CollectionPage from './components/CollectionPage';
import Dashboard from './components/Dashboard'; // Create this if not exists

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: '/',
        element: <Dashboard />,
      },
      {
        path: '/collection/:symbol',
        element: <CollectionPage />,
      },
    ],
  },
]); 