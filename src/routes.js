import Home from './Home.jsx';
import NotFound from './NotFound.jsx';
import SetNewAvatar from './SetNewAvatar.jsx';
import Dashboard from './Dashboard/Dashboard.jsx';
import AdminPanel from './AdminPanel/AdminPanel.jsx';

const routes = [
    { path: '/dashboard', component: Dashboard },
    { path: '/changeavatar', component: SetNewAvatar },
    { path: '/admin', component: AdminPanel },
    { path: '/', component: Home, exact: true },
    { path: '/', component: NotFound }
];

export default routes;
