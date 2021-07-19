import jwt from 'jsonwebtoken';
import fetchData from '../../src/fetchData';

export default async function auth(req, res, next) {
    try {
        let token = await fetchData(`query {token}`);
        token = token.token;
        const isTokenExpired = await fetchData(`
            query verifyToken($token: String!) {
                verifyToken(token: $token)
            }
        `, {token});
        if (isTokenExpired.verifyToken == 'jwt expired') {
            token = '';
        }
        const user = jwt.decode(token);

        if (req.route.path == '/dashboard/' || req.route.path == '/dashboard') {
            res.redirect('/signin');
            return;
        }

        if (token != '' && req.params[0] != user.name && req.params[0] != `${user.name}/subscriptions` && req.params[0] != `${user.name}/changeavatar` && !req.params[0].includes('products') && req.params[0] != 'FAQ' && req.params[0] != 'subscriptions' && req.params[0] != 'changeavatar') {
            res.redirect(`/dashboard/${user.name}`);
        }
        
        if (token == '' && req.route.path == '/dashboard/*') {
            res.redirect('/signin');
            return;
        }

        if (token != '' && req.route.path != '/dashboard/*') {
            res.redirect(`/dashboard/${user.name}`)
            return;
        }

        next();
    } catch (error) {
        console.log(error);
    }
}