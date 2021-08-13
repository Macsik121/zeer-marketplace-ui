import Home from './Home.jsx';
import NotFound from './NotFound.jsx';
import Dashboard from './Dashboard/Dashboard.jsx';
import AdminPanel from './AdminPanel/AdminPanel.jsx';

const routes = [
    { path: '/dashboard', component: Dashboard },
    { path: '/admin', component: AdminPanel },
    { path: '/', component: Home, exact: true },
    { path: '/', component: NotFound }
];

export default routes;
