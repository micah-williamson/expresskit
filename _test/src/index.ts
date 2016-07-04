declare var require: any;

import {Restkit} from 'restkit';

import {ExpressServer} from '../../index';

let bodyParser = require('body-parser');

import './auth/router';
import './basic/router';
import './middleware/router';
import './rules/router';
import './user/router';

Restkit.start({
  server: new ExpressServer(),
  middleware: [
    bodyParser.json()
  ]
});