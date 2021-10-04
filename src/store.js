let __UI_SERVER_ENDPOINT__ = 'http://localhost:8080';
let __SERVER_ENDPOINT_ADDRESS = 'http://localhost:3000/graphql';

// if (process.env.mode == 'production') {
    // __UI_SERVER_ENDPOINT__ = 'https://zeer-marketplace-ui-macsik121.herokuapp.com';
    // __SERVER_ENDPOINT_ADDRESS = 'https://zeer-marketplace-api-macsik121.herokuapp.com/graphql';
// }

module.exports = {
    __UI_SERVER_ENDPOINT__,
    __SERVER_ENDPOINT_ADDRESS
};
