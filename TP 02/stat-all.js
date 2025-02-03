import { exec } from 'child_process';

// Inicializa o JSON Server
exec('json-server --watch db.json --port 3001', (err, stdout, stderr) => {
  if (err) {
    console.error(`Erro ao iniciar o JSON Server: ${err.message}`);
    return;
  }
  console.log(`JSON Server iniciado:\n${stdout}`);
});

// Inicia o servidor do frontend (exemplo com React ou outro framework)
exec('npm start', (err, stdout, stderr) => {
  if (err) {
    console.error(`Erro ao iniciar o frontend: ${err.message}`);
    return;
  }
  console.log(`Frontend iniciado:\n${stdout}`);
});
