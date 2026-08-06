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

Consulta el [README principal](../README.md) para conocer la funcionalidad y la
estructura completa.
