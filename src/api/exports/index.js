const ExportsHanlder = require('./handler');
const routes = require('./routes');

module.exports = {
    name: 'exports',
    version: '1.0.0',
    register: (server, { service, validator }) => {
        const exportsHanlder = new ExportsHanlder(service, validator);

        server.route(routes(exportsHanlder));
    }
};
