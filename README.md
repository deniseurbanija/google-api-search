# 🗺️ Implementación de Google Places API

## 📝 ¿Qué hace esta implementación?

1. Permite buscar direcciones mientras escribes
2. Muestra sugerencias de direcciones reales
3. Autocompleta los campos del formulario
4. Valida que las direcciones sean reales
5. Restringe la búsqueda por país (en este caso, Argentina)

## 🔍 ¿Cómo funciona?

### 1. Configuración Inicial

- Instalar dependencias con este comando
- Necesitamos una "llave mágica" (API Key) de Google
- Esta llave va en un archivo especial llamado `.env`:

```env
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=tu_api_key_aquí
```

### 2. Carga del Mapa (google-maps.ts)

```typescript
// Cuando alguien usa la app por primera vez:
1. Verificamos si Google Maps ya está cargado
2. Si no está cargado, añadimos un "script" a la página
3. Este script descarga todo lo necesario de Google Maps
```

### 3. Búsqueda de Direcciones (use-google-places-autocomplete.tsx)

- Cuando escribes en el campo de dirección:
  1. Esperamos a que escribas al menos 3 letras
  2. Hacemos una pausa de 300ms para no sobrecargar a Google
  3. Enviamos lo que escribiste a Google
  4. Google nos devuelve sugerencias de direcciones reales

### 4. Componente de Búsqueda (address-search.tsx)

Es como un formulario inteligente que:

- Tiene un menú desplegable para elegir el país
- Muestra un campo para escribir la dirección
- Muestra las sugerencias de Google en una lista
- Marca con un ✓ la dirección que seleccionaste
- Tiene un botón para escribir la dirección manualmente

## 🎯 Ejemplo de Uso

1. El usuario selecciona un país (por ejemplo, "Argentina")
2. Empieza a escribir una dirección ("Av. Corrie...")
3. Google sugiere direcciones reales:
   - Av. Corrientes 1234, Buenos Aires
   - Av. Corrientes 5678, Buenos Aires
4. El usuario selecciona una dirección
5. ¡Listo! La dirección queda guardada y validada

## 🚀 Ventajas de Usar Google Places

1. **Direcciones Reales**:

   - Todas las direcciones existen de verdad
   - Menos errores en los envíos

2. **Formato Correcto**:

   - Las direcciones tienen un formato estándar
   - Más fácil para procesar y enviar

3. **Actualizado**:
   - Google actualiza sus datos constantemente
   - Siempre tenemos las direcciones más recientes
