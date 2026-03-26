
# 🚀 Radiografía del Proyecto: Arquitectura Técnica

Estructura de ingeniería detrás de Distribuidora MyDog 2.0.

## 1. Stack Tecnológico
- **Framework:** Next.js 15 (App Router).
- **Lenguaje:** TypeScript (Tipado estricto para seguridad de datos).
- **Estilos:** Tailwind CSS + Shadcn UI (Componentes atómicos y orgánicos).
- **Backend (Local):** Firebase Client (Auth, Firestore para perfiles y favoritos).
- **Backend (Externo/ERP):** Firebase Admin (Acceso seguro a catálogo y pedidos globales).
- **IA:** Genkit (Asistente de ventas inteligente y empático).

## 2. Arquitectura de Datos
### Proyecto Storefront (Local)
- **Responsabilidad:** Autenticación de usuarios finales y gestión de la `wishlist`.
- **Seguridad:** Firestore Security Rules para proteger datos privados de clientes.

### Proyecto ERP (Remoto)
- **Responsabilidad:** Fuente de verdad para el catálogo de productos, stock en tiempo real y recepción de órdenes.
- **Integración:** Server Actions actúan como puente seguro entre el cliente y el ERP.

## 3. Lógica de Negocio Crítica
- **Precios Dinámicos:** El sistema detecta el rol del usuario (`customer` vs `wholesale`) y ajusta los precios en todo el sitio instantáneamente.
- **Caché Inteligente:** Uso de `unstable_cache` en el servidor para que el catálogo cargue en milisegundos sin saturar las lecturas de Firestore.
- **Despacho RM:** Lógica logística centrada exclusivamente en la Región Metropolitana de Santiago.
