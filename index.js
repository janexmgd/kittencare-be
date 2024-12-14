import server from './src/server.js';
import env from './src/utils/env.js';
const port = env.APP_PORT || 7627;
process.stdout.write('\x1Bc');
server.listen(port, '0.0.0.0', () => {
  console.log('app running at port ' + port);
});
