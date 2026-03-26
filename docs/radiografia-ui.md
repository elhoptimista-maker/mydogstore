# 🎨 Radiografía de UI: Componentes y Secciones Orientados a la Conversión

Desglose integral de la interfaz de usuario bajo principios de SRP (Responsabilidad Única), Diseño Orgánico y Optimización de Tasa de Conversión (CRO). Cada píxel y componente tiene una misión clara en el embudo de ventas.

## 1. La Navegación (Header de 3 Capas)
- **Capa 1: TopBar (Incentivo Logístico):** Barra superior de bajo perfil pero alto impacto. Contiene el mensaje transaccional directo ("Despacho gratis sobre $50.000 en toda la RM 🚚") y enlaces de confianza (Soporte WhatsApp, Instagram).
- **Capa 2: MainHeader (Identidad y Conversión):** Logo de MyDog alineado a la izquierda para reconocimiento inmediato, SmartSearch centralizado y amplio, y acceso ultra-rápido a Favoritos y al Carrito de Compras (CartDrawer) con un indicador visual numérico que resalta cuando hay ítems.
- **Capa 3: MenuBar (Exploración Comercial):** Acceso a categorías claras por especie, botón destacado (con color de contraste) para "Ofertas de Bodega", enlace al "Blog Nutricional" para SEO y retención, y accesos diferenciados a "Mi Cuenta" y "Portal Mayorista (B2B)".

## 2. La Home (Embudo de Ventas Perfecto)
1. **Hero Section:** Impacto visual inmediato. Promesa de valor clara respaldada por trayectoria (15 años) + CTA transaccional inequívoco ("Explorar la tienda" o "Comprar su alimento").
2. **Pet Navigation (Venta Consultiva):** Navegación visual por especie guiada por IA. En lugar de íconos estáticos, usamos un enfoque de resolución de problemas ("¿Alergias? Te guío hacia el alimento perfecto").
3. **Super-Cards Promocionales (Banners Bicolores):** Espacios para destacar colecciones rentables o de temporada (ej. "Nutrición Clínica", "Accesorios de Paseo") con CTAs directos.
4. **Featured Products (Grilla de Alta Rotación):** Tarjetas de producto atómicas con badges de stock real ("Últimas unidades"). Botones de "Agregar al Carrito" optimizados con micro-copy de confianza ("🔒 Compra segura").
5. **Flash Deal (Urgencia Ética):** Bloque de urgencia visual con contador dinámico. Ofertas reales de bodega para liberar stock. CTA enfocado en FOMO: "Ver ofertas de hoy".
6. **Social Proof (Testimonios):** Carrusel de historias de "La Manada" que validan nuestra trayectoria y cumplimiento logístico en Santiago. El antídoto contra el abandono de carrito.
7. **Trust Bar (Barra de Confianza):** Íconos minimalistas garantizando los pilares del servicio (Pago 100% seguro, Despacho garantizado en la RM, Soporte experto por WhatsApp).
8. **Instagram Gallery:** Integración social que muestra el día a día en la bodega, humanizando la operación logística.

## 3. Áreas Funcionales Clave
- **SmartSearch (Motor de Búsqueda Predictivo):** Panel de resultados flotante que autocompleta marcas y necesidades cruzadas (ej: "comida hipoalergénica perro"). Minimiza clics hacia la conversión.
- **CartDrawer (Motor de Upselling):** Gestión lateral del pedido sin abandonar la navegación. Debe incluir obligatoriamente la barra de progreso de gamificación ("¡Estás a solo $X de ganar envío gratis en la RM!").
- **ProductCard (Tarjeta de Producto):** Componente reutilizable. Exhibe urgencia de stock, precio dinámico (tachado si hay oferta, distinción B2B/B2C) y acción primaria de un solo clic.
- **ProductAssistant (IA Genkit):** Asistente integrado con personalidad cálida pero experta. Resuelve objeciones de compra en tiempo real.

## 4. Identidad Visual
- **Colores:** Primario (#008080 - Verde Esmeralda, transmite salud y confianza), Secundario (#FFD600 - Mango, transmite energía y llamadas a la acción).
- **Geometría:** Uso consistente de `rounded-[2.5rem]` para componentes grandes, dando una sensación orgánica, segura y amigable (alejada de los bordes rectos corporativos).
- **Sombras:** Uso de `shadow-xl` con baja opacidad (`shadow-black/5`) para crear profundidad sutil y jerarquía sin ensuciar la interfaz.