# Back-end de Around the U.S.

API REST de usuarios y tarjetas protegida mediante JWT.

## Desarrollo local

```bash
pnpm install
pnpm dev
```

El servidor usa `mongodb://localhost:27017/aroundb` y escucha en
`http://localhost:3000`. Para desarrollo no necesita un archivo `.env`; si se
requiere personalizar la configuración, se puede copiar `.env.example` como
`.env`.

En producción deben definirse `NODE_ENV=production` y `JWT_SECRET`. `MONGO_URL`
y `PORT` permiten sustituir sus valores predeterminados cuando la infraestructura
lo requiera. El servidor se detiene al arrancar en producción si no existe
`JWT_SECRET`.

## Comandos

- `pnpm start`: inicia el servidor.
- `pnpm dev`: inicia el servidor con recarga automática.
- `pnpm lint`: verifica el estilo del código.
- `pnpm test`: ejecuta las pruebas automatizadas.

La ruta `GET /crash-test` finaliza el proceso de forma deliberada y se utiliza
únicamente para comprobar que PM2 reinicia la API durante el despliegue.

## Ejecución con PM2

En el servidor, crea primero `.env` a partir de `.env.example` y reemplaza
`JWT_SECRET` con un valor seguro. Después instala PM2 e inicia la configuración
de producción:

```bash
pnpm install --prod
npm install --global pm2
pm2 start ecosystem.config.js --env production
pm2 startup
pm2 save
```

`pm2 startup` muestra un comando adicional con privilegios elevados; ejecútalo
exactamente como lo genere PM2. Para comprobar la recuperación automática:

```bash
curl http://localhost:3000/crash-test
pm2 status
pm2 logs around-api --lines 50
```

Después de la caída deliberada, `around-api` debe volver a aparecer con estado
`online` y un contador de reinicios mayor.

## Proxy inverso con Nginx

La configuración HTTP utilizada para publicar la API se encuentra en
[`../deploy/nginx/around-api.conf`](../deploy/nginx/around-api.conf). En el
servidor se instala como un sitio de Nginx y se habilita mediante un enlace
simbólico:

```bash
sudo cp ../deploy/nginx/around-api.conf /etc/nginx/sites-available/around-api
sudo ln -s /etc/nginx/sites-available/around-api /etc/nginx/sites-enabled/around-api
sudo nginx -t
sudo systemctl reload nginx
```

Nginx recibe en `api.aroundtw.mooo.com` las solicitudes HTTP destinadas a la API
y las reenvía a PM2 en `127.0.0.1:3000`. El mismo archivo publica el front-end
desde `/var/www/around-frontend` para `aroundtw.mooo.com` y
`www.aroundtw.mooo.com`.

Consulta el [README principal](../README.md) para conocer la funcionalidad y la
estructura completa.
