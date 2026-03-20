
# Radiografía de Credenciales: MyDog E-commerce vs ERP

Este documento explica cómo manejamos dos proyectos de Firebase de forma simultánea y segura.

## 1. El E-commerce (Local Project)
- **Alcance:** Cliente (Navegador).
- **Misión:** Autenticación de usuarios, gestión de favoritos (Wishlist) y perfil de usuario.
- **Acceso:** SDK de Cliente (`firebase/auth`, `firebase/firestore`).
- **Seguridad:** Basada en Reglas de Seguridad de Firestore.

## 2. El ERP (External Project)
- **Alcance:** Servidor (Next.js Server Actions).
- **Misión:** Fuente de verdad del catálogo, stock y pedidos globales.
- **Acceso:** SDK de Administración (`firebase-admin`) vía Service Account.
- **Seguridad:** No expuesto al cliente. Solo accesible por el servidor validado.

## 3. Flujo de Transacción Segura
1. **Identificación:** El cliente obtiene un `idToken` de su sesión local.
2. **Puente:** Envía el token al Server Action `processCheckout`.
3. **Validación:** El servidor usa `getStorefrontAuthAdmin()` para verificar que el token es real y vigente.
4. **Inyección:** Una vez validado el `userId`, el servidor usa `getErpDbAdmin()` para escribir el pedido en el proyecto ERP.

## Variables de Entorno Requeridas
### Para el Storefront (Local)
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`: ID del proyecto e-commerce.
- `FIREBASE_CLIENT_EMAIL`: Email de la service account local.
- `FIREBASE_PRIVATE_KEY`: Llave privada de la service account local.

### Para el ERP (Remoto)
- `ERP_FIREBASE_PROJECT_ID`: ID del proyecto ERP.
- `ERP_FIREBASE_CLIENT_EMAIL`: Email de la service account del ERP.
- `ERP_FIREBASE_PRIVATE_KEY`: Llave privada de la service account del ERP.
