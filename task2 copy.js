const http = require('http');
const routes = require('./routes')
//routes.anotherFun();
routes.testfun();

const server = http.createServer(routes.handler);
server.listen(3000, () => {
    console.log('Server is running');
});
