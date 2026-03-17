# **App Name**: MydogStore

## Core Features:

- Mobile-First Homepage: A responsive, minimalist homepage displaying featured products and essential navigation, optimized for mobile devices.
- Product Listing Page (PLP): Displays a catalog of products with filters and sorting options, fetching data from Firestore via Server Components for optimal SEO.
- Product Detail Page (PDP): Shows comprehensive product information, images, and add-to-cart functionality, powered by Firestore data through Server Components.
- Intelligent Product Assistant: An AI-powered tool that recommends products based on user input such as dog breed, age, or specific needs, enhancing discovery.
- Real-time Product Data: Securely manage and retrieve product catalog data from Firestore, with all direct database queries encapsulated in Server Components or strictly memoized client-side hooks.
- Global Error Emitter: A centralized mechanism for handling and capturing specific errors like Firestore permission failures, replacing standard console error logging.
- SEO & Analytics Integration: Configures core layout for Server-Side Rendering (SSR) and includes placeholders for Google Tag Manager (GTM) and product JSON-LD structured data for enhanced search visibility.

## Style Guidelines:

- A light color scheme to achieve a clean and sophisticated feel. The primary color is a refined deep blue (#2E62AC), suggesting trust and quality. The background is a subtly cool, nearly white (#ECF0F3), offering ample negative space. The accent color is a vibrant yet tasteful cyan-blue (#34C4E4), used for calls to action and highlights, providing clear visual emphasis without overpowering the minimalist design.
- Body and headline font: 'Inter' (sans-serif) for its modern, clean, and objective aesthetic, aligning with the premium minimalist design and ensuring readability across all devices.
- Minimalist, line-based icons that complement the clean interface. Icons should have soft, rounded edges to harmonize with the overall design language and provide a friendly yet premium feel.
- Mobile-first, responsive layout with generous spacing and ample padding around elements to create an 'Apple-style' premium feel. Headers and floating elements like the cart will utilize a subtle glassmorphism effect (blur and transparency) for depth and modernity.
- Subtle and smooth transitions, especially for elements using glassmorphism, ensuring a polished user experience. Animations for interactions (e.g., adding to cart, filtering products) will be swift and elegant, enhancing responsiveness without distraction.