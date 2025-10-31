// =============================================
// MÓDULOS REQUERIDOS
// =============================================
// http-errors: Para crear errores HTTP
const createError = require('http-errors');
// express: Framework web para Node.js
const express = require('express');
// path: Módulo para trabajar con rutas de archivos y directorios
const path = require('path');
// cookie-parser: Middleware para analizar cookies
const cookieParser = require('cookie-parser');
// morgan: Middleware para el registro de solicitudes HTTP
const logger = require('morgan');
// express-session: Para manejar sesiones
const session = require('express-session');
// connect-flash: Para mensajes flash
const flash = require('connect-flash');

// =============================================
// ENRUTADORES
// =============================================
// Importa el enrutador principal (página de inicio)
var indexRouter = require('./routes/index');
// Importa el enrutador de usuarios
var usersRouter = require('./routes/users');

// =============================================
// CONFIGURACIÓN DE LA APLICACIÓN EXPRESS
// =============================================
var app = express();

// Configuración del motor de plantillas EJS
// Establece el directorio donde se encuentran las vistas
app.set('views', path.join(__dirname, 'views'));
// Establece EJS como el motor de plantillas
app.set('view engine', 'ejs');

// =============================================
// MIDDLEWARES
// =============================================
// Middleware para servir archivos estáticos (CSS, JS, imágenes, etc.)
// desde el directorio 'public'
app.use(express.static(path.join(__dirname, 'public')));

// Middleware para el registro de solicitudes HTTP en modo 'dev'
// Muestra información detallada en la consola sobre cada solicitud
app.use(logger('dev'));

// Middleware para analizar cuerpos de solicitud en formato JSON
app.use(express.json());

// Middleware para analizar cuerpos de solicitud codificados en URL
// extended: false - usa la biblioteca querystring para analizar
app.use(express.urlencoded({ extended: false }));

// Middleware para analizar cookies
app.use(cookieParser());

// =============================================
// CONFIGURACIÓN DE SESIÓN
// =============================================
app.use(session({
  secret: 'tu_secreto_seguro',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // Configurar a true si usas HTTPS
}));

// =============================================
// MIDDLEWARE PARA MENSAJES FLASH
// =============================================
app.use(flash());

// Middleware para hacer los mensajes flash disponibles en todas las vistas
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
});

// =============================================
// RUTAS
// =============================================
// Rutas principales de la aplicación
// Las rutas que comienzan con '/' son manejadas por indexRouter
app.use('/', indexRouter);
// Las rutas que comienzan con '/users' son manejadas por usersRouter
app.use('/users', usersRouter);

// =============================================
// MANEJO DE ERRORES
// =============================================
// Captura cualquier ruta no definida y genera un error 404
app.use(function(req, res, next) {
  // Crea un error 404 y lo pasa al siguiente middleware
  next(createError(404));
});

// Manejador de errores global
app.use(function(err, req, res, next) {
  // Establece variables locales, proporcionando el error solo en desarrollo
  res.locals.message = err.message;
  // En desarrollo, muestra el stack trace del error
  // En producción, no muestra detalles del error por seguridad
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // Renderiza la página de error
  // Establece el código de estado de la respuesta
  res.status(err.status || 500);
  // Renderiza la plantilla 'error' con los datos del error
  res.render('error');
});

// =============================================
// EXPORTACIÓN DE LA APLICACIÓN
// =============================================
// Exporta la aplicación para que pueda ser utilizada por otros módulos
// (como el archivo www en la carpeta bin)
module.exports = app;
