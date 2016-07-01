var Expresskit = require('./bld/index.js').default;

require('./bld/_test/src/basic/router');
require('./bld/_test/src/auth/router');
require('./bld/_test/src/user/router');
require('./bld/_test/src/rules/router');
require('./bld/_test/src/middleware/router');

Expresskit.start();

// tests:
require('./basicRouting.test.js');
require('./auth.test.js');
require('./dto.test.js');
require('./rules.test.js');
require('./middleware.test.js');