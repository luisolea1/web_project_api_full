# Front-end de Around the U.S.

Cliente React de la aplicación full stack. Incluye registro, inicio de sesión,
persistencia del JWT, rutas protegidas y las operaciones de perfil y tarjetas.

Todas las solicitudes se envían al back-end local de este repositorio; no se
utilizan las APIs externas de TripleTen.

## Desarrollo local

```bash
pnpm install
pnpm dev
```

La aplicación queda disponible en `http://localhost:5173` y espera la API en
`http://localhost:3000`.

## Comandos

- `pnpm dev`: inicia Vite en modo desarrollo.
- `pnpm build`: genera la compilación de producción.
- `pnpm lint`: verifica el estilo del código.
- `pnpm preview`: muestra localmente la compilación.

Consulta el [README principal](../README.md) para conocer la funcionalidad y la
estructura completa.
