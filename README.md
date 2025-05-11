````markdown
# Backend API - Case Tyba

Este repositorio contiene la solución para la prueba técnica de Backend Engineer para Tyba. A continuación, se detallan las instrucciones necesarias para ejecutar la API localmente y probar su funcionamiento.

## Requisitos

- **Node.js** (versión 20 o superior)
- **Docker** (opcional, si deseas ejecutar la API mediante Docker)

## Instalación y Ejecución

### Clonar el Repositorio

1. Clona este repositorio a tu máquina local:

   ```bash
   git clone https://github.com/landrescaballero/restaurant-finder-backend.git
   cd restaurant-finder-backend
````

### Instalación de Dependencias

2. Instala las dependencias del proyecto:

   ```bash
   npm install
   ```

### Variables de Entorno

3. Crea un archivo `.env` en la raíz del proyecto con las siguientes variables de entorno (personaliza según sea necesario):

   ```env
    PORT=
    DB_HOST=
    DB_PORT=
    DB_USERNAME=
    DB_PASSWORD=
    DB_NAME=
    JWT_SECRET=
    MAP_API_KEY=
    MAP_URL_COORDINATES=
    MAP_URL_CITY=
    MAP_FIELD_MASK=   
   ```

### Ejecutar la API

4. Inicia la API:

   ```bash
   npm start
   ```

   Esto levantará el servidor en `http://localhost:{PORT}`, dependiendo del puerto indicado por la variable de entorno.

### Docker (Opcional)

Si prefieres ejecutar la API usando Docker, puedes utilizar Docker Compose. Asegúrate de tener **Docker** y **Docker Compose** instalados en tu máquina.

5. Ejecuta el siguiente comando para levantar la API dentro de un contenedor Docker:

   ```bash
   docker-compose up
   ```

   El servicio estará disponible en `http://localhost:{PORT}`, dependiendo del puerto indicado por la variable de entorno.
   Es importante tener en cuenta que se debe crear el archivo `.env` en el root del proyecto, para cargar las variables de entorno al contenedor.

## Endpoints

### 1. Validar Estado de la API

* **Método**: `GET`
* **Ruta**: `/`
* **Respuesta fallida**:

  ```String
  OK!
  ```

### 2. Registro de Usuario

* **Método**: `POST`
* **Ruta**: `/users/register`
* **Cuerpo de la solicitud**:

  ```json
  {
    "firstName": "John",
    "lastName": "Doe",
    "username": "johndoe",
    "password": "Password123!"
  }
  ```
* **Respuesta exitosa**:

  ```json
  {
    "status": true,
    "message": "User registered successfully",
    "data": {
      "id": 1,
      "username": "johndoe",
      "firstName": "John",
      "lastName": "Doe"
    }
  }
  ```
* **Respuesta fallida**:

  ```json
  {
    "status": false,
    "message": "string"
  }  
  ```

### 3. Login de Usuario

* **Método**: `POST`
* **Ruta**: `/auth/login`
* **Cuerpo de la solicitud**:

  ```json
  {
    "username": "johndoe",
    "password": "Password123!"
  }
  ```
* **Respuesta exitosa**:

  ```json
  {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6..."
  }
  ```
* **Respuesta fallida**:

  ```json
  {
    "status": false,
    "message": "string"
  }
  ```

### 4. Validar Sesión

* **Método**: `GET`
* **Ruta**: `/auth/validate-session`
* **Respuesta exitosa**:

  ```json
  {
    "message": "string",
    "status": true
  }
  ```
* **Respuesta fallida**:

  ```json
  {
    "message": "Unauthorized",
    "status": false
  }
  ```

### 5. Restaurantes Cercanos a una Coordenada

* **Método**: `GET`
* **Ruta**: `/restaurants/coordinates`
* **Parámetros**:

  * `latitude(Query)`: Latitude of the location
  * `longitude(Query)`: Longitude of the location
* **Respuesta exitosa**:

  ```json
  [
    {
      "name": "Joe's Diner",
      "address": "123 Main St, New York, NY",
      "mapUrl": "https://maps.google.com/?q=Joe's+Diner",
      "websiteUrl": "https://joesdiner.com",
      "types": [
        "restaurant",
        "food"
      ]
    }
  ]
  ```
* **Respuesta fallida**:

  ```json
  { 
    "status": false,
    "message": "string"
  }
  ```

### 6. Restaurantes Cercanos a una Coordenada

* **Método**: `GET`
* **Ruta**: `/restaurants/city`
* **Parámetros**:

  * `city(Query)`: Name of the city to search restaurants in
* **Respuesta exitosa**:

  ```json
  [
    {
      "name": "Joe's Diner",
      "address": "123 Main St, New York, NY",
      "mapUrl": "https://maps.google.com/?q=Joe's+Diner",
      "websiteUrl": "https://joesdiner.com",
      "types": [
        "restaurant",
        "food"
      ]
    }
  ]
  ```
* **Respuesta fallida**:

  ```json
  { 
    "status": false,
    "message": "string"
  }
  ```

### 7. Consultar Transacciones

* **Método**: `GET`
* **Ruta**: `/transactions/users`
* **Respuesta exitosa**:

  ```json
  [
    {
      "id": 1,
      "method": "CITY",
      "query": "New York",
      "result": [
        {
          "name": "Restaurant 1",
          "address": "123 Main St",
          "mapUrl": "https://maps.google.com/?q=Restaurant+1",
          "websiteUrl": "http://restaurant1.com",
          "types": [
            "restaurant"
          ]
        }
      ],
      "createdAt": "2025-05-11T12:34:56.789Z",
      "user": {
        "id": 1,
        "name": "John Doe"
      }
    }
  ]
  ```
* **Respuesta fallida**:

  ```json
  { 
    "status": false,
    "message": "string"
  }
  ```

### 8. Logout de Usuario

* **Método**: `POST`
* **Ruta**: `/logout`
* **Respuesta exitosa**:

  ```json
  {
    "message": "User logged out successfully",
    "status": true
  }
  ```
* **Respuesta fallida**:

  ```json
  { 
    "status": false,
    "message": "string"
  }
  ```

## Pruebas Automatizadas

Para ejecutar las pruebas automatizadas en este proyecto, puedes usar el siguiente comando:

```bash
npm test
```

Esto ejecutará las pruebas automatizadas, y te dará un informe de los resultados.

## Tecnologías Usadas

* **Node.js** - Framework backend
* **Nest** - Framework para construir la API REST
* **JWT** - Para autenticación y autorización
* **Swagger** - Para la documentación interactiva de la API
* **Docker** (opcional) - Para ejecutar la API en un contenedor

## Seguridad

* **Autenticación segura con JWT**: Se utiliza JSON Web Tokens (JWT) para autenticar a los usuarios y proteger los endpoints.
* **Manejo de sesiones revocables**: Además del uso de JWT, se gestionan sesiones que pueden ser invalidadas en cualquier momento para reforzar la seguridad.
* **Contraseñas seguras**: Las contraseñas se encriptan usando **bcrypt** antes de almacenarlas en la base de datos.
* **No hay secretos quemados en el código**: Todos los secretos como claves API y claves de JWT se almacenan en variables de entorno y no se encuentran en el código fuente.

## Notas Adicionales

* La documentación interactiva de la API está disponible en `GET /api-docs`
* Si tienes alguna pregunta o necesitas más detalles, no dudes en contactarme.

---

¡Gracias por revisar el proyecto! 😊
