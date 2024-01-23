# Descripción


## Correr en dev

1. Clonar el repositorio
2. Crear una copia del archivo .env.template del .env y cambiar las variables de entorno
3. Instalar las dependencias ```npm intall```
4. Levantar la base de datos ```docker compose up -d```
5. Correr las migraciones de Prisma ```npx prima migrate dev```
6. Ejecutar Seed ```npm run seed```
7. Limpiar el LocalStorage del navegador.
8. Correr el proyecto ```npm run dev```


## Correr en prod
