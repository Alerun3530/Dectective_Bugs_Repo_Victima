# repo-victima

API chica de usuarios (Node/Express) usada como "repo víctima" para el proyecto
**El Detective de Bugs**. Contiene 3 bugs plantados a propósito, con distinto
nivel de gravedad, para que el agente (OpenCode / Claude Code) los diagnostique
y decida si los arregla solo o los escala.

## Instalación

```bash
cd repo-victima
npm install
npm start
```

El servidor levanta en `http://localhost:3000`, con un front sencillo servido
en la raíz: lista los usuarios y trae un botón por cada bug para dispararlo
sin usar curl.

## Endpoints

- `GET /api/usuarios` — lista todos los usuarios.
- `GET /api/usuarios/:id` — detalle de un usuario.
- `POST /api/usuarios` — crea un usuario (body: `{ "nombre", "email", "edad" }`).
- `GET /api/usuarios/:id/es-mayor-de-edad` — chequea si el usuario es mayor de edad.
- `GET /api/usuarios/:id/nivel-cliente` — calcula el nivel/tier del cliente.

## Bugs

Ver `README_BUGS.md` (uso interno del equipo) para el detalle de cada bug
plantado, dónde está en el código, y qué se espera que haga el agente con
cada uno.
