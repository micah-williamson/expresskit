tsc
build=`cat "build.js"`
echo "var System = require('systemjs');" "$build" > "build.js";
echo "System.import('index');" >> "build.js";