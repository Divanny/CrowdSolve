# Guía del Proyecto

## Tabla de Contenidos
1. [Configuración Inicial](#configuración-inicial)
2. [Frontend](#frontend)
3. [Rutas y Navegación](#rutas-y-navegación)
4. [Reutilización de Código y Funcionalidades](#reutilización-de-código-y-funcionalidades)
5. [Gestión de API](#gestión-de-api)
6. [Notificaciones](#notificaciones)
7. [Backend](#backend)
8. [Gestión de Ramas](#gestión-de-ramas)
9. [Recursos Adicionales](#recursos-adicionales)

## Configuración Inicial

### 1.1 Archivos de Configuración

#### Backend (appsettings.json)
El backend utiliza un archivo de configuración llamado `appsettings.json`. Este archivo contiene todas las configuraciones necesarias para el funcionamiento del servidor, como cadenas de conexión a bases de datos, configuraciones de autenticación, y otros parámetros esenciales.

#### Frontend (.env)
El frontend utiliza un archivo `.env` para gestionar variables de entorno. Este archivo almacena información sensible y configuraciones específicas del entorno, como claves de API, URLs de servicios, y otros valores que no deben estar expuestos en el código fuente.

Ambos archivos se encuentran disponibles en el siguiente enlace: [Archivos de Configuración](https://estintecedu-my.sharepoint.com/:f:/g/personal/1105621_est_intec_edu_do/EtrQUaujsQZGt3AW9Ni4sykB5HcYqoBJBOW1YuhEme_Bcw?e=OfAgPr)

## Frontend

### 2.1 Librería de Componentes UI: Shadcn

Nuestro frontend está construido utilizando la librería de componentes shadcn, que se basa en Radix UI para proporcionar componentes funcionales y accesibles. Shadcn mejora la estética de los componentes, ofreciendo un diseño más atractivo sin comprometer la funcionalidad.

#### Documentación de Componentes
La documentación sobre la funcionalidad de los componentes se encuentra en Radix UI. Sin embargo, los componentes que importamos y utilizamos son de shadcn. Es importante consultar la documentación de Radix UI para entender el comportamiento y las propiedades de los componentes.

#### Tailwind CSS
Además de shadcn, utilizamos Tailwind CSS para el estilizado. Tailwind nos permite aplicar estilos de manera rápida y consistente a través de clases utilitarias.

### 2.2 Manejo de Colores y Dark Mode

Para mantener la consistencia visual y asegurar que el modo oscuro (dark mode) funcione correctamente, se deben seguir las siguientes pautas:

- **Evitar Colores Específicos en el Código**: Intenten no utilizar colores específicos directamente en el código. En su lugar, utilicen las variables de color definidas en el archivo `global.css`.

- **Variables de Color en global.css**: Todas las variables de color posibles están declaradas en `global.css`. Limítense a utilizar estas variables para garantizar la coherencia y evitar conflictos con el modo oscuro.

## Rutas y Navegación

### 3.1 Registro de Rutas en app.jsx

Todas las rutas de la aplicación se registran en el archivo `app.jsx`. Al definir una nueva ruta, sigan estas directrices:

#### Rutas Protegidas
Si una ruta requiere que el usuario esté autenticado para acceder, envuelvan su componente dentro de `<ProtectedRoute>`. Esto asegura que solo los usuarios autorizados puedan acceder a dicha ruta.

```jsx
<ProtectedRoute>
  // Su componente
</ProtectedRoute>
```

#### Layout Predeterminado
Para que una ruta utilice el layout predeterminado de la página, envuelvan el componente con `<Layout>`.

```jsx
<Layout>
  // Su componente
</Layout>
```

### 3.2 React Router para Navegación

Utilizamos React Router para gestionar la navegación dentro de la aplicación web. Para manejar la navegación, importen y utilicen el hook `useNavigation` proporcionado por React Router.

```jsx
import { useNavigation } from 'react-router-dom';

const YourComponent = () => {
  const navigation = useNavigation();

  // Uso de navigation para redireccionar, etc.
};
```

## Reutilización de Código y Funcionalidades

Antes de implementar una nueva funcionalidad, verifiquen si ya existe algo similar en el proyecto. Esto les permitirá:

- **Copiar Código Existente**: Si ya hay una implementación similar, pueden reutilizar el código existente, lo que ahorra tiempo y asegura la consistencia.

- **Entender el Funcionamiento**: Revisar implementaciones previas les ayudará a comprender mejor cómo funcionan ciertas funcionalidades dentro del proyecto.

## Gestión de API

### 5.1 Hook use-axios

Para manejar las llamadas a la API, utilizamos un hook personalizado llamado `use-axios`, ubicado en la carpeta `hooks`. Este hook facilita la comunicación con el backend mediante las siguientes funcionalidades:

- **Proxy y Token de Usuario**: Todas las llamadas al backend se realizan a través de un proxy. Además, si el usuario está en línea, el hook automáticamente adjunta el token de autenticación en las solicitudes.

- **Pantalla de Carga**: Durante las llamadas a la API, se muestra una pantalla de carga para mejorar la experiencia del usuario.

### 5.2 Configuración Avanzada de use-axios

Si necesitan realizar una llamada a la API sin mostrar la pantalla de carga, pueden pasar una configuración específica al hook `use-axios`:

```javascript
const config = {
  requireLoading: false,
};

useAxios(yourApiCall, config);
```

Esto desactiva la pantalla de carga para esa llamada en particular.

## Notificaciones

Para mostrar notificaciones dentro de la aplicación, utilicen el módulo `sonner`. Importen `toast` desde `sonner` y consulten los ejemplos existentes en la aplicación para ver cómo implementarlas correctamente.

```javascript
import { toast } from 'sonner';

toast.success('¡Operación exitosa!');
toast.error('Hubo un error en la operación.');
```

## Backend

### 7.1 Enfoque en el Trabajo Realizado

En el backend, enfóquense en las funcionalidades que han implementado. Revísen el código existente para entender mejor el flujo y la estructura del backend, lo que facilitará la integración y el desarrollo de nuevas funcionalidades.

## Gestión de Ramas

### 8.1 Creación de Ramas por Feature

Las ramas deben crearse basándose en las funcionalidades (features) que se van a desarrollar. Si van a trabajar en una parte específica del proyecto (frontend o backend), incluyan dicha información en el nombre de la rama.

Nomenclatura de Ramas:

- Feature: `feature/nombre-descriptivo`

Ejemplos:
- `feature/about-us`
- `feature/about-us-frontend`
- Bugfix: `bugfix/nombre`

### 8.2 Unión de Ramas a Develop

Una vez que hayan terminado de trabajar en una rama, deben unirla a la rama `develop` mediante un Pull Request en GitHub. Asegúrense de que el código haya sido revisado y aprobado antes de realizar la unión para mantener la integridad del proyecto.

## Recursos Adicionales

- [Documentación de Shadcn](https://ui.shadcn.com/)
- [Documentación de Radix UI](https://www.radix-ui.com/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [React Router Documentation](https://reactrouter.com/en/main)
- [Sonner Documentation](https://sonner.emilkowal.ski/)

## Conclusión

Siguiendo estas pautas y utilizando los recursos proporcionados, podremos mantener un flujo de trabajo organizado y eficiente, facilitando la colaboración y asegurando la calidad del proyecto. Si tienen alguna duda o necesitan asistencia adicional, no duden en ponerse en contacto con el líder del proyecto o con cualquier otro miembro del equipo.

¡Gracias por su atención y buen trabajo a todos!

**Nota**: Asegúrense de mantener actualizados los archivos de configuración y de seguir las mejores prácticas para el manejo de ramas y la integración continua. Esto ayudará a minimizar conflictos y a mantener un código limpio y funcional.
