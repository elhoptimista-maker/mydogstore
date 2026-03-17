# Fuente de Verdad del Diseño y Arquitectura Visual - MyDog E-commerce

Este documento es la especificación técnica inquebrantable para la construcción del frontend. Define la jerarquía estructural, los layouts de Tailwind CSS y la anatomía exacta de cada componente.

## 0. Meta-Reglas del Sistema de Diseño
- **Geometría y Bordes:** Las interfaces orgánicas exigen esquinas redondeadas. Tarjetas y banners usan `rounded-2xl` o `rounded-3xl`. Botones de acción y avatares usan `rounded-full` (diseño pill). No existen esquinas afiladas (`rounded-none`).
- **Sombras y Profundidad:** El fondo base es `#F6F6F6` o blanco. Los contenedores usan `bg-white` con `shadow-sm` en reposo y `shadow-md hover:-translate-y-1 transition-all` al interactuar.
- **Tipografía (Jerarquía):** - Títulos de Sección: Centrados o alineados a la izquierda, tipografía audaz (`font-extrabold`, `text-3xl` o `text-4xl`). Patrón bicolor: Texto principal oscuro, palabra clave en color `Primary`.
  - Subtítulos: Gris (`text-muted-foreground`), tamaño pequeño (`text-sm`), rastreo amplio (`tracking-wide`, `uppercase`).
- **Contención:** Todo el contenido (excepto fondos full-width) debe estar restringido por un contenedor central (`max-w-7xl mx-auto px-4 md:px-8`).

---

## 1. Navegación Global (Anatomía del Header)
Se divide estrictamente en 3 capas apiladas horizontalmente:

1. **Top Bar (Utilidad):** - *Layout:* `h-10 flex justify-between items-center bg-accent text-accent-foreground`.
   - *Contenido Izquierdo:* Mensaje de bienvenida (ej. "Envíos gratis sobre $30.000").
   - *Contenido Derecho:* Selectores (Idioma, Moneda) y links utilitarios (Seguimiento, Login) separados por divisores tenues.
2. **Main Header (Búsqueda y Acciones):**
   - *Layout:* `h-20 flex justify-between items-center bg-primary text-white`.
   - *Estructura:* 3 columnas.
     - Izquierda: Logo corporativo destacado.
     - Centro (Expansivo): Input de búsqueda en forma de píldora (`rounded-full bg-white`). Contiene internamente un selector de categorías a la izquierda, el input de texto, y un botón de "Lupa" a la derecha incrustado dentro del input.
     - Derecha: Flex container con gap. Teléfono de contacto (icono + texto), Icono de Favoritos (Corazón), e Icono de Carrito con *badge* flotante numérico absoluto.
3. **Menu Bar (Navegación):**
   - *Layout:* Fondo oscuro o gris muy claro. Flex row.
   - *Izquierda:* Botón destacado "Todas las Categorías" (Fondo contrastante, icono de hamburguesa).
   - *Centro:* Enlaces de navegación principales (Home, Tienda, Ofertas, Blog).
   - *Derecha:* Texto de soporte técnico o enlace secundario.

---

## 2. Bloque Hero (Impresión Inicial)
- **Layout:** Contenedor ancho completo con fondo crema/gris sutil. Distribución interna en Grid 2 columnas (`grid-cols-1 md:grid-cols-2`). Altura mínima `min-h-[500px]`.
- **Columna Izquierda (Contenido):**
  - Alineación vertical centrada, texto justificado a la izquierda (`space-y-6`).
  - Badge superior: Píldora verde claro con texto verde oscuro.
  - Título (H1): Masivo (`text-5xl md:text-7xl font-black`), la última palabra va en color verde (ej. "Comida Premium para tu **Mascota**").
  - Párrafo descriptivo: Gris, tamaño legible (`text-lg`).
  - CTA Principal: Botón estilo píldora, color primary, con icono de flecha.
  - Social Proof: Flex row en la base. Grupo de avatares solapados (`-space-x-3`) + texto "100K+ Clientes Felices".
- **Columna Derecha (Visual):**
  - Posicionamiento relativo. Imagen grande, recortada sin fondo (ej. Perro feliz / Dueño y mascota), desbordando sutilmente los márgenes inferiores.

---

## 3. Navegación por Píldoras (Categorías Destacadas)
- **Header:** Subtítulo pequeño superior + Título H2 centrado.
- **Layout:** Flex horizontal con scroll en móvil (`overflow-x-auto snap-x no-scrollbar`), flex-wrap y centrado en Desktop.
- **Anatomía del Item:** - Flex column, centrado (`items-center gap-3`).
  - Circulo perfecto para la imagen/icono (`w-24 h-24 rounded-full bg-muted flex items-center justify-center`).
  - Texto inferior en gris oscuro, centrado.

---

## 4. Super-Cards Promocionales (Banners Bicolores)
- **Layout:** Grid de 2 columnas (`grid-cols-1 md:grid-cols-2 gap-6`).
- **Anatomía de la Tarjeta:**
  - `rounded-3xl relative overflow-hidden p-8 flex items-center`.
  - Tarjeta 1 (Fondo claro/blanco): Texto a la izquierda (Píldora amarilla pequeña, título negro fuerte, Botón píldora Primary). Imagen del producto a la derecha.
  - Tarjeta 2 (Fondo accent/Amarillo): Mismo layout, pero el botón invierte sus colores para contrastar.

---

## 5. Grilla de Productos Estándar (Product Cards)
- **Header de Sección:** Flex row. Izquierda: Título H2 + Subtítulo. Derecha: Botón outline "Ver Todos".
- **Layout:** Grid responsive (`grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4`).
- **Anatomía Exacta de la Tarjeta (`ProductCard`):**
  - Contenedor: `bg-white border border-border/50 rounded-2xl p-4 flex flex-col relative group transition-shadow hover:shadow-lg`.
  - Badges (Top Left, Absolutos): Píldoras miniatura para "Oferta" (Fondo rojo) o "Nuevo" (Fondo Primary).
  - Acciones (Top Right, Absolutos): Icono de corazón (Favoritos) y Ojo (Quick View) que aparecen en hover.
  - Imagen: Contenedor `aspect-square`, imagen centrada con `object-contain`.
  - Meta: Flex row inferior. Categoría en gris muy pequeño (`text-xs text-muted-foreground uppercase`).
  - Título: `font-bold text-sm text-foreground line-clamp-2`.
  - Rating: Estrellas amarillas pequeñas + número de reseñas.
  - Footer de Tarjeta (Flex Row justify-between items-center):
    - Izquierda: Precio actual (`text-lg font-black text-primary`) y precio anterior tachado (`text-xs text-muted-foreground line-through`).
    - Derecha: Botón cuadrado con bordes curvos (`w-10 h-10 rounded-xl bg-muted group-hover:bg-primary text-primary group-hover:text-white transition-colors flex items-center justify-center`). Contiene el icono de `ShoppingCart`.

---

## 6. Sección de Oferta Relámpago (Flash Deal + Cuenta Regresiva)
- **Layout:** Fondo sutil (gris muy claro). Grid de 3 columnas (Imagen Izq, Contenido Centro, Imagen Der).
- **Columna Central (El Controlador):**
  - Texto superior "Oferta de Verano", "Hasta 50% de Descuento" en texto masivo.
  - **Cuenta Regresiva:** Flex row gap-4. 4 círculos blancos (`w-16 h-16 rounded-full flex flex-col items-center justify-center shadow-sm`). Número grande arriba, unidad de tiempo (Días, Hrs) pequeña abajo.
  - Botón CTA: Píldora verde centrada.

---

## 7. Tarjetas de Producto Horizontales (Deals of the Day)
- **Layout:** Grid de 2 a 3 columnas. Se usa para productos de alta rotación.
- **Anatomía de la Tarjeta:**
  - Flex Row (`flex-row bg-white rounded-2xl p-4 border border-border gap-4`).
  - Izquierda: Contenedor cuadrado para la imagen.
  - Derecha: Flex Col. Título, Rating de estrellas, Precio destacado.
  - Funcionalidad Extra: Barra de progreso lineal indicando el stock disponible (ej. "Vendido: 40/100").
  - CTA: Botón "Agregar" estirado al ancho total de la columna derecha.

---

## 8. Banner de Ancho Completo (Full-Bleed CTA)
- **Layout:** Sin márgenes laterales (`w-full bg-primary text-white`).
- **Estructura Interna:** Contenedor `max-w-7xl mx-auto` en Grid de 2 columnas.
- **Izquierda:** Textos masivos, botón estilo píldora amarillo (accent) para máximo contraste.
- **Derecha:** Composición de múltiples imágenes superpuestas sin fondo (ej. Cajas de alimento, juguetes).

---

## 9. Prueba Social (Testimonios)
- **Layout:** Fondo gris tenue. Flex col centralizado.
- **Carrusel Central:** - Fila superior de 5 avatares circulares superpuestos y pequeños, con el avatar central ligeramente más grande y enfocado.
  - Cita o texto del testimonio centrado, itálico, tamaño medio-grande (`text-xl font-medium`).
  - Nombre del cliente en negrita y rol (ej. "Dueño de Golden Retriever") en gris abajo.
- **Navegación:** Dos botones circulares negros absolutos a los lados de la pantalla para "Atrás/Adelante".

---

## 10. Noticias y Blog (Tarjetas Fotográficas)
- **Layout:** Grid de 3 columnas (`grid-cols-1 md:grid-cols-3 gap-6`).
- **Anatomía de la Tarjeta:**
  - `flex flex-col gap-4`. (A diferencia de los productos, NO tienen contenedor blanco ni borde, son orgánicas).
  - Imagen superior: `aspect-[4/3] rounded-2xl overflow-hidden relative`. 
  - Badge sobre la imagen: Píldora amarilla en la esquina inferior izquierda indicando la fecha o categoría.
  - Título: H3 bold.
  - Enlace "Leer más": Texto color primary con flecha a la derecha.

---

## 11. Sección de Acordeón (FAQ)
- **Layout:** Grid de 2 columnas. Izquierda (Título y descripción), Derecha (Acordeón).
- **Anatomía del Acordeón:**
  - Item Activo/Abierto: `bg-primary text-white rounded-xl p-4`. Muestra el texto de respuesta. El icono es un "Menos" blanco.
  - Item Inactivo/Cerrado: `bg-white text-foreground rounded-xl p-4 border`. El icono es un "Más" gris.

---

## 12. Barra de Confianza (Trust Bar)
- **Layout:** Row horizontal debajo del footer o FAQ. Grid de 4 columnas.
- **Anatomía del Item:** Flex row (`items-center gap-4`).
  - Izquierda: Icono SVG enmarcado en un círculo amarillo tenue.
  - Derecha: Flex col. Título en negrita, Subtítulo en gris muy pequeño (ej. "Soporte 24/7", "Asistencia garantizada").

---

## 13. Galería de Instagram
- **Layout:** Row de 5 o 6 imágenes cuadradas perfectas `aspect-square`. Sin gap (`gap-0`) o con gap mínimo para efecto de tira fotográfica. Las imágenes abarcan el 100% del ancho del contenedor y escalan.

---

## 14. Footer Masivo
- **Top Row (Suscripción):** Fondo crema. Flex col centrado. Input de email ancho, tipo píldora (`rounded-full`), con el botón de "Suscribirse" alojado *dentro* del mismo contenedor derecho del input.
- **Main Footer:** - Fondo `bg-primary` (Verde oscuro).
  - Grid de 4 a 5 columnas.
  - Columna Izquierda: Logo (en blanco), texto descriptivo, iconos de redes sociales.
  - Columnas Centrales: Enlaces de navegación con hover effect (`hover:underline text-white/80`).
  - Base (Bottom Row): Flex row justify-between. Izquierda: Copyright. Derecha: Iconos de medios de pago (Visa, Mastercard, etc.).
