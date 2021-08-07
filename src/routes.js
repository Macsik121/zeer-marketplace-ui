import Home from './Home.jsx';
import NotFound from './NotFound.jsx';
import SetNewAvatar from './SetNewAvatar.jsx';
import Dashboard from './Dashboard/Dashboard.jsx';
import AdminPanel from './AdminPanel.jsx';

const routes = [
    { path: '/dashboard/:username', component: Dashboard },
    { path: '/admin/:username/changeavatar', component: SetNewAvatar },
    { path: '/admin/:username', component: AdminPanel },
    { path: '/', component: Home, exact: true },
    { path: '/', component: NotFound }
];

export default routes;
