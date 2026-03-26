
# 🎨 Radiografía de UI: Componentes y Secciones

Desglose de la interfaz de usuario bajo principios de SRP (Responsabilidad Única) y Diseño Orgánico.

## 1. La Navegación (Header de 3 Capas)
- **Capa 1: TopBar (Utilidad):** Mensajes de despacho y confianza.
- **Capa 2: MainHeader (Identidad):** Logo alineado a la izquierda, SmartSearch centralizado y acciones de conversión (Favoritos/Carrito).
- **Capa 3: MenuBar (Exploración):** Acceso a categorías y distinción entre Mundo Retail y Portal B2B.

## 2. La Home (Embudo de Conversión)
1. **Hero Section:** Impacto visual y declaración de amor familiar.
2. **Pet Navigation:** Navegación por especie mediante "Amigos que te escuchan" (Guías conversacionales).
3. **Promotional Banners:** Super-Cards bicolores para destacar colecciones.
4. **Featured Products:** Grilla densa de productos con stock asegurado.
5. **Flash Deal:** Bloque de urgencia con contador dinámico.
6. **Social Proof:** Carrusel de testimonios de "La Manada".
7. **Blog & News:** Educación y consejos de nutrición.
8. **Trust Bar:** Beneficios logísticos (Envío gratis, Entrega Flash).
9. **Instagram Gallery:** Integración social y vida diaria en la bodega.

## 3. Áreas Funcionales
- **SmartSearch:** Motor de búsqueda predictivo con panel de resultados flotante.
- **CartDrawer:** Gestión lateral del pedido sin abandonar la navegación.
- **ProductCard:** Tarjeta atómica con badges de stock, precio dinámico y acciones en hover.
- **ProductAssistant:** Asistente de IA (Genkit) con personalidad cálida integrado en la interfaz.

## 4. Identidad Visual
- **Colores:** Primario (#008080 - Verde Esmeralda), Secundario (#FFD600 - Mango).
- **Geometría:** `rounded-[2.5rem]` para una sensación orgánica y segura.
- **Sombras:** `shadow-xl` con baja opacidad para profundidad sutil.
