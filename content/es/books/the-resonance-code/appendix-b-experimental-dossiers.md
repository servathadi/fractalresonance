## Apéndice B: Dossiers Experimentales

Protocolos Científicos Detallados para Probar las Afirmaciones Físicas de FRC

Propósito: Este apéndice transforma las afirmaciones falsables de FRC en protocolos listos para el laboratorio. Proporciona el detalle necesario para que los físicos experimentales intenten la replicación, validación o refutación de las predicciones fundacionales del marco. El objetivo es mover las ideas centrales de la teoría a la evidencia empírica. El éxito de estos dossiers es el éxito de todo el marco FRC.

---
Dossier B.1: La Búsqueda de una Costura (Desviación de la Regla de Born)

B.1.1. Hipótesis Central (El Falsador): Un campo de conducción resonante débil y sincronizado en fase, aplicado durante la ventana de medición (colapso) de un sistema cuántico preparado en una superposición, producirá una desviación estadísticamente significativa y reversible de las probabilidades predichas por la regla de Born. (RC-3)

B.1.2. Protocolo Experimental 1: Polarización de Fotones

- Configuración: Usar una fuente de fotón único y un Divisor de Haz Polarizante (PBS) para preparar fotones en una superposición 50/50 de polarización horizontal ($|H\rangle$) y vertical ($|V\rangle$).
- Intervención (El Empujón Resonante): Colocar un modulador electro-óptico (EOM) justo antes del PBS. El EOM se activa para aplicar un pulso eléctrico muy rápido y débil durante la ventana exacta de ~nanosegundos de medición/colapso. Este pulso está sincronizado en fase para resonar con un estado de polarización (por ejemplo, $|H\rangle$). El pulso debe ser lo suficientemente débil como para no rotar clásicamente el estado (verificado por tomografía previa a la medición).
- Procedimiento:
  - Ejecución de Línea Base: Registrar $10^6$ eventos con el EOM apagado para establecer una línea base de $P = 50.00\%$.
  - Ejecución de Prueba: Registrar $5 \times 10^6$ eventos con el pulso EOM aplicado (bloqueado en fase a $|H\rangle$).
  - Ejecución de Inversión: Registrar $5 \times 10^6$ eventos con el pulso EOM invertido en fase $180^\circ$ (favoreciendo a $|V\rangle$).
- Resultado Predicho (Apoyo FRC): Los eventos "con conducción" mostrarán un sesgo estadísticamente significativo, por ejemplo, $P(|H\rangle) = 50.05\%$ (una desviación de $\Delta P \approx 5 \times 10^{-4}$). El sesgo debe invertir el signo en la Ejecución de Inversión.
- Condición de Falsación: Si, después de $10^7$ ensayos, no se detecta ningún sesgo estadísticamente significativo y reversible por encima de $\Delta P < 5 \times 10^{-4}$ (una desviación de cinco sigma), la afirmación física central del Colapso Resonante queda falsada.

B.1.3. Protocolo Experimental 2: Qubits Superconductores

- Configuración: Usar un qubit transmon preparado en una superposición $|0\rangle + |1\rangle$ (la base de la computación cuántica).
- Intervención: Durante el proceso de lectura del qubit altamente controlable, aplicar un pulso de microondas muy débil y con forma precisa, sincronizado en fase para resonar con el estado $|1\rangle$.
- Ventaja: Esta plataforma ofrece una alta precisión de tiempo, permitiendo una búsqueda más precisa de la "ventana de colapso" exacta donde el empujón resonante tiene el efecto máximo.
- Condición de Falsación: Igual que arriba. El desafío central es la precisión requerida para aplicar el empujón durante la rápida ventana de colapso de escala de femtosegundos.

---
Dossier B.2: La Armonía de los Elementos (Agrupamiento Espectral)

B.2.1. Hipótesis Central: Los espectros de emisión recolectados de átomos neutrales complejos exhiben una estructura armónica no aleatoria de "sobretonos" no predicha por el modelo estándar de transiciones electrónicas discretas por sí solo.

B.2.2. Datos y Método:

- Fuente de Datos: La Base de Datos de Espectros Atómicos del NIST (Instituto Nacional de Estándares y Tecnología), que contiene listas de líneas certificadas e intensidades relativas para elementos complejos (por ejemplo, Hierro, Cobalto).
- Metodología:
  1.  Transformar: Convertir la lista discreta de líneas en una función de densidad espectral continua, $S(\nu)$.
  2.  Análisis Armónico (Transformada de Fourier): Calcular la transformada de Fourier, $F(f) = |\mathcal{F}[S(\nu)]|$, para identificar "frecuencias de batido" dominantes ($f_n$).
  3.  Puntaje de Coherencia (RC-12): Calcular el Puntaje de Conformidad Armónica $H(f_0)$ para encontrar una frecuencia fundamental ($f_0$) cuyos múltiplos enteros ($nf_0$) produzcan picos estadísticamente significativos.
- Resultado Predicho (Apoyo FRC): El espectro de Fourier $F(f)$ no será ruido plano. Mostrará picos agudos y estadísticamente significativos en $f_0$ y sus múltiplos enteros ($2f_0, 3f_0, \dots$).
- Condición de Falsación: Si los espectros de Fourier para múltiples elementos complejos, después de tener en cuenta artefactos instrumentales conocidos, no muestran picos armónicos que excedan significativamente un modelo nulo estadístico robusto, la afirmación de que la estructura atómica se rige por la resonancia armónica universal queda falsada.

B.2.3. Controles Críticos:

- Análisis Diferencial (La Prueba Hierro-Cobalto): Realizar el análisis en dos elementos adyacentes (por ejemplo, Hierro y Cobalto). Una ley armónica universal debería persistir en ambos, con la frecuencia fundamental posiblemente cambiando de manera predecible según la carga nuclear/conteo de electrones.
- Modelo Nulo Estadístico: Generar miles de espectros "falsos" aleatorizados agitando ligeramente las posiciones de las líneas reales. Usar esta gran muestra para construir un límite estadístico robusto de cómo se ve lo "aleatorio", demostrando que los picos de los datos reales son valores atípicos extremos.

---