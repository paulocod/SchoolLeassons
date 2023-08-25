var PROTO_PATH = __dirname + '/../../protos/helloworld.proto';

var parseArgs = require('minimist');
var grpc = require('@grpc/grpc-js');
var protoLoader = require('@grpc/proto-loader');
var packageDefinition = protoLoader.loadSync(
    PROTO_PATH,
    {keepCase: true,
     longs: String,
     enums: String,
     defaults: true,
     oneofs: true
    });
var hello_proto = grpc.loadPackageDefinition(packageDefinition).helloworld;

function main() {
  var argv = parseArgs(process.argv.slice(2), {
    string: 'target'
  });
  var target;
  if (argv.target) {
    target = argv.target;
  } else {
    target = 'localhost:50051';
  }
  var client = new hello_proto.Greeter(target,
                                       grpc.credentials.createInsecure());

  client.createMessage({content: 'ola', author: 'brunao'}, function(err, response) {
    console.log('Greeting:', response.id);
  });
  
  client.getMessage({id: response.id}, function(err, response) {
    console.log('Get Message reposta:', response.content + " " + response.author);
  });

  client.updateMessage({id: response.id, content: "Aula Topicos", author: "Ricardo Sabatine"}, function(err, response) {
    console.log('Update message reposta:', response.id);
  });
}

main();
