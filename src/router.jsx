import { createBrowserRouter } from 'react-router-dom';
import App from './App';
import CollectionPage from './components/CollectionPage';
import CollectionsList from './components/CollectionsList';
import Dashboard from './components/Dashboard';

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
        path: '/collections',
        element: <CollectionsList />,
      },
      {
        path: '/collection/:symbol',
        element: <CollectionPage />,
      },
    ],
  },
]); 