# 🧠 Lógica de Negocio y Estrategia Comercial | MyDog Store

Este documento define las reglas algorítmicas que rigen el comportamiento del catálogo y el motor de conversión. Es el "Cerebro Comercial" de la plataforma.

## 1. El Algoritmo "Smart Sort"
El ordenamiento por defecto del catálogo no es manual ni alfabético. Se basa en una puntuación dinámica calculada en tiempo real:

**Fórmula de Éxito:**
`Score = (Tracción * 0.4) + (Sentimiento * 0.4) + (Calidad * 0.2)`

- **Tracción (40%):** Representa el volumen de búsqueda y ventas. Prioriza lo que el mercado ya valida.
- **Sentimiento (40%):** Representa la lealtad y baja tasa de devolución. Protege la reputación de la tienda.
- **Calidad (20%):** Representa el valor nutricional/técnico. Asegura el bienestar a largo plazo.

## 2. The Healthy Switch (Nudge Marketing)
**Objetivo:** Migrar al cliente de marcas económicas a marcas Premium/Super Premium.
**Activador:** Adición al carrito de un producto con Score de Calidad < 2.
**Acción:** Banner dinámico sugiriendo un upgrade a una marca con Calidad > 4, resaltando el beneficio en salud y la pequeña diferencia de inversión.

## 3. Predictive Bundling (Venta Cruzada)
El sistema detecta compras de alta tracción (ej: Master Dog o Champion) y predice necesidades complementarias basándose en el Tier de la marca:
- **Tier Comercial/Económico:** Sugiere salud preventiva (Simparica) y snacks de limpieza (Dentastix).
- **Tier Premium:** Sugiere accesorios de alta durabilidad o arenas sanitarias de alto rendimiento.

## 4. Priorización en Búsqueda
Las búsquedas genéricas (ej: "comida perro") inyectan un boost de relevancia a productos con `Sentimiento > 8` y `Tracción > 8`.
