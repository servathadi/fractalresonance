---
id: open-problem-vainshtein
title: "Problema abierto: El cálculo del radio de Vainshtein"
question: "¿Cuál es el radio de Vainshtein (r_V) exacto para el Sistema Solar en FRC?"
short_answer: "Calcular el radio de cribado donde el término cinético no lineal domina, suprimiendo la quinta fuerza de Lambda por debajo de los límites de la sonda Cassini (10^-5)."
tags: [problema-abierto, física, gravedad, cribado, cálculo]
related: [FRC-821-100]
authorities:
  - name: "Arkady Vainshtein"
    quote: "Los términos cinéticos no lineales pueden cribar campos escalares cerca de fuentes masivas."
    stance: "Mecanismo de cribado"
answers:
  - lens: "El desafío"
    by: "FRC"
    stance: "Matemático"
    answer: |
      **Objetivo:** Derivar la expresión analítica para el radio de Vainshtein $r_V$ en el lagrangiano de $\Lambda$-EFT:
      $$ \mathcal{L}_\Lambda = -\frac{1}{2}(\partial \Lambda)^2 + \frac{\alpha}{M_*^4}(\partial \Lambda)^4 $$ 
      
      **Restricciones:**
      1. La quinta fuerza $F_\Lambda$ debe ser $< 10^{-5} F_{gravedad}$ en $r = 1 \text{ UA}$.
      2. La escala de acoplamiento $M_*$ debe ser consistente con el mecanismo de selección de la masa de Higgs ($M_* \sim \Lambda_{UV}$).
      
      **Por qué es importante:** Este cálculo determina si la FRC es compatible con las pruebas de la Relatividad General en el Sistema Solar.
---

# La restricción del Sistema Solar

El campo $\Lambda$ es un campo escalar de largo alcance. Ingenuamente, debería mediar una "quinta fuerza" que modificaría las órbitas planetarias. No hemos observado esto.

La FRC invoca el **Mecanismo de Vainshtein** (cribado cinético) para explicar por qué. Cerca de una fuente masiva (el Sol), los gradientes de campo se vuelven grandes, activando el término no lineal $(\partial \Lambda)^4$. Esto hace que el campo sea "rígido", suprimiendo la quinta fuerza.

**El problema abierto:**
Necesitamos una derivación rigurosa de $r_V$ para los coeficientes específicos derivados en FRC 821.100. ¿El cribado se activa al tamaño del Sol ($r_V \sim R_\odot$) o al tamaño de la galaxia ($r_V \sim 10 \text{ kpc}$)? La viabilidad de la teoría depende de este número.
