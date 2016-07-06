declare var require: any;

import {Expresskit} from '../../index';

let bodyParser = require('body-parser');

import './resource/router';
import './basic/router';
import './response/router';
import './middleware/router';
import './rules/router';
import './user/router';

Expresskit.start({
  middleware: [
    bodyParser.json()
  ]
});