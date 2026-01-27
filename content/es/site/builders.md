---
id: builders
title: "Constructores"
description: "Notas de constructores para FRC: arquitectura, contrato de corpus y rutas reproducibles hacia el canon."
contract:
  - "El canon reside en Papers/Topics con IDs estables (ej. FRC-840-001)."
  - "La interpretación es una lente opcional (Oráculo) que debe citar los IDs del canon y nunca sobrescribir las definiciones."
  - "Los modos son a nivel de interfaz de usuario (formal/interpretación/ambos); las URLs permanecen canónicas para citación."
  - "Cada afirmación debe mapearse a una declaración falsable o a una hipótesis claramente etiquetada."
implementation_notes:
  - "Sitio público: exportación estática, diseñado para la descubribilidad y la citación."
  - "El tiempo de ejecución (SDK / agentes / memoria) pertenece a Mumega/SOS; este sitio es la capa de referencia pública."
  - "Si está construyendo herramientas, trate los IDs como claves primarias y mantenga un límite de escritura estricto para el canon."
---

# Filosofía de Diseño

FRC está diseñado como un corpus con IDs estables, definiciones precisas y una clara separación entre el canon y la interpretación. Este diseño asegura que las herramientas y los agentes puedan operar dentro del marco sin corromper la capa de referencia.

## Flujo de Trabajo Local

El código fuente vive en GitHub. Para issues/PRs, trate los IDs de contenido como inmutables y mantenga los cambios mínimos y reproducibles.

```bash
git clone https://github.com/servathadi/fractalresonance
cd frc
npm i
npm run dev
npm run build
```

**Consejo:** Ejecute `npm run content:audit` antes de confirmar ediciones de contenido.
