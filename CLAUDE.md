# Página web de Grupo Genesia: instrucciones para Claude

Este repositorio es **público**: solo contiene la página web grupogenesia.com y material promocional. **No guardes aquí información interna** (comisiones, manuales, datos de asesores, finanzas, memoria del negocio). Eso vive en el Drive privado del dueño.

## Quién es el usuario
- Wil, dueño de Grupo Genesia (Guatemala). Escribe en español y es principiante en lo técnico: explica en palabras sencillas y paso a paso.

## Reglas de trabajo
1. **Vista previa antes de publicar**: muestra los cambios (captura o vista previa) antes de subirlos.
2. **Solo sube a `main` cuando Wil escriba "súbelo".** Después de subir, verifica que la publicación de Cloudflare terminó con éxito.
3. Antes de subir, ejecuta `git fetch origin main` y revisa si hay cambios de otra sesión; si los hay, haz rebase.
4. No inventes precios, testimonios ni datos: si falta información, pregunta.

## Sitio
- Sitio estático en `public/` (HTML, CSS y JS), servido por Cloudflare Workers; `src/index.js` atiende `/api/consulta`.

## Marca
- Colores: azul `#14374a`, noche `#0c222e`, océano `#1e6f9a`, cian `#5bc0eb`, dorado `#b7851f` / `#f2cf7a` / `#e8be5c`, verde WhatsApp `#1f8f4e`, pin rojo `#E0342F`.
- Letras: Libre Baskerville (títulos) y Source Sans 3 (texto).

## Cuidados en los textos
- Nunca prometer la aprobación de una visa ni de una tesis.
- Tesis: la elabora el estudiante; Genesia **le ayuda en su elaboración**.
