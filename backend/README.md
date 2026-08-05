# Back-end de Around the U.S.

API REST de usuarios y tarjetas protegida mediante JWT.

## Desarrollo local

```bash
pnpm install
pnpm dev
```

El servidor usa `mongodb://localhost:27017/aroundb` y escucha en
`http://localhost:3000`. Para desarrollo no necesita un archivo `.env`; la clave
JWT de desarrollo está definida en el código.

## Comandos

- `pnpm start`: inicia el servidor.
- `pnpm dev`: inicia el servidor con recarga automática.
- `pnpm lint`: verifica el estilo del código.

Consulta el [README principal](../README.md) para conocer la funcionalidad y la
estructura completa.
