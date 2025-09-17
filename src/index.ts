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

      // 🔑 Garantia: se por acaso o Restify entregar como string, tentamos parsear
      if (typeof parsedBody === 'string') {
        try {
          parsedBody = JSON.parse(parsedBody);
        } catch {
          console.warn('Body veio como string não parseável.');
        }
      }

      // 🔑 JSON normalizado (string simples)
      const rawBody = JSON.stringify(parsedBody);

      // 🔑 JSON com escapes (\")
      const escapedString = JSON.stringify(rawBody);

      console.log('=== [WEBHOOK RECEBIDO] ===');
      console.log('Content-Type:', req.headers['content-type']);
      console.log('Raw Body (JSON normalizado):', rawBody);
      console.log('Objeto interpretado (req.body):', parsedBody);
      console.log('JSON Escapado:', escapedString);

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
