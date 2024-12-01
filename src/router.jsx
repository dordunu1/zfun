import { createBrowserRouter } from 'react-router-dom';
import App from './App';
import Dashboard from './components/Dashboard';
import CollectionsList from './components/CollectionsList';
import CollectionPage from './components/CollectionPage';
import HistoryPage from './pages/HistoryPage';

export const router = createBrowserRouter([
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
    ],
  },
]); 