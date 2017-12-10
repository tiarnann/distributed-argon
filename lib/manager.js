const cluster = require('cluster');
const numCPUs = require('os').cpus().length;
const worker = require('./worker')

if(cluster.isMaster){
  console.log(`Master ${process.pid} is running`);

  // Fork workers.
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    console.log(`worker ${worker.process.pid} died`);
  });
} else {
	worker()
}