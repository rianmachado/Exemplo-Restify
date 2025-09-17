const restify = require('restify');

type RestifyRequest = any;
type RestifyResponse = any;
type RestifyNext = any;

const server = restify.createServer();

// bodyParser global
server.use(restify.plugins.bodyParser());

server.post(
  '/webhook',
  restify.plugins.bodyParser({ returnRawBody: true }),
  (req: RestifyRequest, res: RestifyResponse, next: RestifyNext) => {
    try {
      let parsedBody: any = req.body;

      // Se vier como string escapada, força parse manual
      if (typeof parsedBody === 'string') {
        try {
          console.log('>>>>>>>> VEIO COMO STRING, ESCAPADA...');
          parsedBody = JSON.parse(parsedBody);
        } catch {
          console.warn('Body veio como string não parseável.');
        }
      }

      // JSON normalizado
      const rawBody = JSON.stringify(parsedBody);

      // Força preservação das barras escapadas (\/)
      const withEscapedSlashes = rawBody.replace(/\//g, '\\/');

      // Versão final escapada
      const escapedString = JSON.stringify(withEscapedSlashes);

      console.log('=== [WEBHOOK RECEBIDO] ===');
      console.log('Content-Type:', req.headers['content-type']);
      console.log('Raw Body (JSON normalizado):', rawBody);
      console.log('Com barras escapadas (\\/):', withEscapedSlashes);
      console.log('JSON Escapado Final:', escapedString);

      // 🔑 Sempre responde com JSON válido
      res.setHeader('Content-Type', 'application/json');
      res.send(parsedBody);

      return next();
    } catch (err: any) {
      console.error('[ERRO /webhook]', err);
      res.send(400, { success: false, message: err.message });
      return next(false);
    }
  }
);

server.listen(3000, () => {
  console.log('%s listening at %s', server.name, server.url);
});
