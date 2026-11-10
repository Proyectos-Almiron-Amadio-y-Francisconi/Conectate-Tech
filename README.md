# Conectate Tech 💻

**Trabajo Práctico 2 – Aplicaciones Híbridas (React)**

Plataforma e-commerce simulada de hardware y periféricos, desarrollada con React.js. Permite explorar un catálogo de componentes de PC, armar un carrito de compras y, si se ingresa como administrador, gestionar los productos desde una interfaz gráfica.

## 👥 Integrantes
* Florencia Almiron
* Candela Francisconi Torres
* Franco Ezequiel Amadio

## 🎯 Temática
Tienda online de hardware de PC (procesadores, placas de video, refrigeración, periféricos, etc.). No usa backend ni API externa: los datos iniciales están en un JSON local y los cambios se guardan en el navegador (localStorage).

## 🔐 Usuarios y roles

| Rol | Email | Contraseña | Qué puede hacer |
|---|---|---|---|
| Administrador | admin@conectate.tech | admin123 | Todo lo del cliente + panel Admin para agregar, editar y eliminar productos |
| Común (cliente) | cliente@conectate.tech | cliente123 | Ver catálogo, ver detalle, usar el carrito y finalizar la compra |

Sin iniciar sesión se puede navegar el catálogo y armar el carrito, pero para finalizar la compra hay que ingresar. El panel Admin está protegido: un usuario común o sin sesión no puede entrar.

## ✨ Funcionalidades principales
* Catálogo con filtro por categoría y buscador.
* Detalle de cada producto (`/producto/:id`).
* Carrito de compras con cantidades, subtotales y total (se mantiene al recargar).
* Login y logout con validaciones.
* Panel de administración: listar, agregar, editar y eliminar productos, con formularios validados.
* Botón "Restaurar catálogo" para volver a los productos originales.
* Página 404 para rutas inexistentes.

## 🛠️ Tecnologías
React.js (componentes funcionales y hooks: `useState`, `useEffect`, `useContext`, `useReducer`, `useMemo`), React Router DOM, Context API, CSS plano, Vite como herramienta de desarrollo.

## 🗂️ Estructura
```
src/
├── components/   Navbar, Footer, ProductCard, CategoryFilter, ProductImage, RutaAdmin
├── context/      AuthContext (sesión), ProductsContext (catálogo), CartContext (carrito)
├── data/         hardware.json (productos iniciales), usuarios.json
├── pages/        Home, ProductDetail, Cart, Login, Admin, ProductForm, NotFound
├── utils/        format.js
├── App.jsx       rutas
└── main.jsx      providers
```

## ⚙️ Cómo levantar el proyecto
Necesitás tener instalado [Node.js](https://nodejs.org) (versión 18 o superior).

```bash
git clone https://github.com/Proyectos-Almiron-Amadio-y-Francisconi/Conectate-Tech.git
cd Conectate-Tech
npm install
npm run dev
```

Después abrí el link que aparece en la terminal (normalmente http://localhost:5173).

## 🌐 Aplicación publicada
(Pegar acá el link de Vercel)

## 📸 Captura de pantalla
(Agregar acá una captura del proyecto. Ejemplo: guardar la imagen en `public/captura.png` y escribir `![Captura](public/captura.png)`)
