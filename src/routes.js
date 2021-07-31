import Home from './Home.jsx';
import NotFound from './NotFound.jsx';
import ResetPassword from './ResetPassword.jsx';
import SetNewAvatar from './Dashboard/SetNewAvatar.jsx';
import Dashboard from './Dashboard/Dashboard.jsx';

const routes = [
    {path: '/reset', component: ResetPassword},
    {path: '/dashboard/:username', component: Dashboard},
    {path: '/dashboard/:username/changeavatar', SetNewAvatar},
    {path: '/', component: Home, exact: true},
    {path: '/', component: NotFound}
];

export default routes;