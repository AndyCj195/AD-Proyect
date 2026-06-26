# 👤 Manual de Usuario — Sistema de Chat en Tiempo Real

Este manual guía a los usuarios en el uso de la aplicación **ChatApp**, detallando cómo registrarse, iniciar sesión y utilizar todas las características interactivas de comunicación en tiempo real.

---

## 1. Acceso al Sistema

1. Abra su navegador web preferido (Google Chrome, Firefox, Edge, etc.).
2. Ingrese a la dirección local del cliente de la aplicación:
   ```
   http://localhost:4200
   ```
3. Será redirigido automáticamente a la pantalla de **Iniciar Sesión**.

---

## 2. Registro de Cuenta Nueva

Si no posee una cuenta registrada, siga estos pasos:

1. En la tarjeta de acceso, haga clic en la pestaña **Registrarse**.
2. Escriba un **Usuario** único (por ejemplo: `andres_chavez`).
3. Ingrese una **Contraseña** segura.
4. Presione el botón **Crear cuenta**.
5. Si el usuario ya existe, se mostrará una advertencia. En caso exitoso, se iniciará sesión de forma automática y accederá a la sala de chat.

---

## 3. Inicio de Sesión (Login)

Si ya posee una cuenta creada:

1. Asegúrese de estar en la pestaña **Iniciar Sesión**.
2. Escriba su **Usuario** y su **Contraseña**.
3. Presione el botón **Entrar al chat** (o presione la tecla `Enter`).
4. Si las credenciales son válidas, ingresará a la sala general del chat.

> [!TIP]
> **Usuario de Prueba**: Para comodidad en las pruebas del sistema, la aplicación viene con un usuario pre-configurado que se crea automáticamente al iniciar el servidor:
> - **Usuario**: `prueba`
> - **Contraseña**: `prueba123`

*Nota: Si intenta acceder directamente a la ruta `/chat` sin iniciar sesión, el sistema de seguridad le denegará el acceso y lo devolverá a la pantalla de Login.*

---

## 4. Sala de Chat y Características Principales

Una vez dentro del chat, la pantalla se divide en dos secciones principales:

```
+-----------------------------------+------------------------------------------+
|  💬 ChatApp                       |  # general   Canal principal del chat    |
|                                   +------------------------------------------+
|  👤 CONECTADOS (3)                |                                          |
|                                   |  [Sistema] andres_chavez se unió al chat |
|  • Andres (Tú)                    |                                          |
|  • Juliet                         |  Juliet: Hola a todos!                   |
|  • Omar                           |                                          |
|                                   |  Andres (Tú): Hola Juliet, ¿cómo va?     |
|                                   |                                          |
|                                   |  Omar está escribiendo...                |
|  +-----------------------------+  +------------------------------------------+
|  👤 Andres                      |  | Escribe un mensaje...               | >  |
|  [ Salir ]                     |  +------------------------------------------+
+-----------------------------------+------------------------------------------+
```

### A. Barra Lateral (Sidebar - Panel Izquierdo)
- **Logotipo y Versión**: Ubicados en la cabecera del panel.
- **Lista de Usuarios Conectados**: Muestra en tiempo real a todos los usuarios que tienen el chat abierto en ese momento.
  - Se visualiza un avatar con la letra inicial de su nombre.
  - Tu propio usuario aparecerá destacado con una etiqueta que dice **"Tú"**.
- **Panel de Usuario**: En la parte inferior se muestra tu avatar e identidad de cuenta.
- **Botón Salir**: Permite cerrar la sesión de forma segura.

### B. Ventana de Conversación (Panel Derecho)
- **Cabecera**: Muestra el canal actual (`#general`).
- **Historial de Mensajes**:
  - Al conectarte, se cargarán de manera automática los últimos 50 mensajes de la sala para que no pierdas el hilo de la conversación.
  - **Mensajes del Sistema**: Notificaciones automáticas de color atenuado e itálicas que anuncian cuándo un compañero se une o abandona el chat.
  - **Mensajes de Terceros**: Mensajes normales con el avatar, el nombre del remitente y la hora exacta de recepción.
  - **Mensajes Propios**: Tus mensajes se muestran con un color de fondo azulado y tu nombre resaltado en verde (**"Tú"**) para una fácil lectura.
- **Indicador de Escritura**: Si algún usuario está escribiendo un mensaje, en la parte inferior izquierda aparecerá un aviso dinámico con animación de puntos suspensivos (ej: `Omar está escribiendo...`).

### C. Área de Entrada de Texto
- Ingrese su mensaje en el cuadro de texto que dice *"Escribe un mensaje en #general..."*.
- El mensaje tiene un límite máximo de 500 caracteres.
- Para enviar el mensaje:
  - Presione el botón **Enviar (➤)** en el extremo derecho.
  - O simplemente pulse la tecla **Enter** en su teclado.

---

## 5. Salida Segura (Logout)

Cuando desee salir de la aplicación:

1. Diríjase a la esquina inferior izquierda de la barra lateral.
2. Presione el botón **⬅ Salir**.
3. El sistema destruirá su token de sesión (`localStorage`), cerrará de forma segura la conexión de sockets en el backend (eliminándole de la lista de usuarios activos) y le redirigirá a la pantalla de login.
