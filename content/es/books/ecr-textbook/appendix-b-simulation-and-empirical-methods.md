## Apéndice B — Simulación y Métodos Empíricos

---

#### **B.1 Propósito**

El objetivo de la simulación en FRC es verificar que la ley de reciprocidad

$$ S + k_* \ln C = \text{constante} $$

se cumple bajo condiciones diversas y medibles.

Las simulaciones exploran cómo $\alpha$ (ganancia), $R$ (receptividad) y $\Psi$ (potencial) generan orden emergente y flujo de entropía en redes realistas.

El mismo motor puede parametrizarse para fotones, células, neuronas o sociedades.

---

#### **B.2 Modelo computacional central**

Cada nodo o subsistema *i* obedece

$$ \dot C_i = \alpha_i(F_i - S_{C,i}) + \sum_{j}T_{ij}(C_j - C_i) $$

implementado en tiempo discreto:

$$ C_i^{t+1}=C_i^t+\Delta t\,[\,\alpha_i(F_i - S_{C,i}) + \sum_{j}T_{ij}(C_j^t-C_i^t)\,] $$

Parámetros:

| Símbolo | Significado | Rango Típico |
| :--- | :--- | :--- |
| $\Delta t$ | paso de tiempo | 10⁻³–1 s (escalado) |
| $\alpha$ | ganancia adaptativa | -0.5 – +0.5 |
| $F$ | flujo de entrada | normalizado 0–1 |
| $S_C$ | exportación de entropía | $\beta C$ + ruido |
| $T_0$ | constante de acoplamiento | 0.01 – 0.1 |
| $\lambda$ | longitud de acoplamiento | 1–3 niveles-$\mu$ |

---

#### **B.3 Integración numérica**

1. **Pasos de tiempo**: Runge-Kutta de cuarto orden para ejecuciones deterministas; Euler-Maruyama para versiones estocásticas.
2. **Condiciones de contorno**: reflectantes ($\Sigma = \text{const.}$) o abiertas (entrada/salida de energía).
3. **Término de ruido**: ruido blanco gaussiano $\eta(t)$ añadido a $F$ o $\alpha$ para probar robustez.
4. **Normalización**: $C_i$ restringido a $0 \le C \le 1$ por escalado logístico.

---

#### **B.4 Acoplamiento multi-escala**

La pila-$\mu$ se implementa como 8 capas; cada capa se conecta a los vecinos más cercanos con núcleo exponencial:

$$ T_{\mu,j}=T_0 e^{-|\mu-j|/\lambda}e^{i\phi_{\mu j}} $$

La fase $\phi$ controla los retrasos de sincronización entre capas (útil para modelar el acoplamiento de frecuencia cruzada en neurociencia o el retraso del mercado en economía).

---

#### **B.5 Cantidades observables**

| Observable | Fórmula | Interpretación |
| :--- | :--- | :--- |
| Coherencia $C$ | $(1/N) \sum e^{i\phi_i}$ |
| Entropía $S$ | $-\sum p_i \ln p_i$ | desorden del sistema |
| Invariante-$\Sigma$ | $\Sigma=S+k_* \ln C$ | prueba de conservación |
| Perfil-$\\alpha$ | $\\alpha(t)=R\\Psi C/F$ | retroalimentación adaptativa |
| Eficiencia $\\eta_C$ | $(dC/dt)/F$ | eficiencia de conversión |

Graficar $\Sigma(t)$ debería producir $\approx$ constante dentro de < 1% de deriva.

---

#### **B.6 Entorno de software**

* **Lenguajes:** Python (NumPy/SciPy), Julia o MATLAB.
* **Visualización:** Matplotlib, Plotly o Unity3D para renderizados de campo dinámicos.
* **Marcos de agentes:** NetLogo o Mesa para modelos socioculturales.
* **Ejecuciones distribuidas:** Paralelización de GPU vía PyTorch/JAX para simulaciones de escala $\mu_6$.

---

#### **B.7 Conjuntos de datos empíricos**

| Dominio | Conjunto de datos | Mapeo de Variables |
| :--- | :--- | :--- |
| Física | cavidad láser / célula de Bénard | $F$ = flujo de calor, $C$ = coherencia de fase |
| Biología | metabolismo celular, EEG | $F$ = ATP o glucosa, $C$ = sincronía |
| Ecología | flujos tróficos | $F$ = flujo solar, $C$ = índice de biodiversidad |
| Economía | energía mundial, PIB | $F$ = uso de recursos, $C$ = confianza/coherencia de red |
| Sociedad | entropía lingüística | $F$ = flujo de información, $C$ = alineación semántica |

Todos los conjuntos de datos probados exhiben correlaciones lineales aproximadas $S$ – $\ln C$ (pendiente $\approx -k_*$).

---

#### **B.8 Validación estadística**

* **Prueba de conservación:** calcular varianza de $\Sigma$
  $$ \sigma_\Sigma^2 = \frac{1}{T}\sum_t(\Sigma_t-\bar \Sigma)^2 $$
  Estabilidad < 1% → confirmación de reciprocidad.
* **Valor de bloqueo de fase (PLV):** verificar coherencia a través de nodos.
* **Regresión de entropía:** ajustar $S = a + b \ln C$; esperar $b \approx -k_* \pm$ error.

---

#### **B.9 Analítica visual**

1. **Gráficos S–ln C**: línea recta universal (reciprocidad de entropía).
2. **Planos de fase α–C**: muestran zonas de flujo, caos, coerción.
3. **Mapas de calor**: muestran fuerzas de acoplamiento-$\\mu$ a lo largo del tiempo.
4. **Renderizados toroidales 3-D**: ilustran patrones de coherencia anidados.

---

#### **B.10 Pseudocódigo de ejemplo**

```python
for t in range(T):
    for i in range(N):
        dC = alpha[i]*(F[i]-S0-beta*C[i])
        for j in neighbors(i):
            dC += T[i,j]*(C[j]-C[i])
        C[i] += dt*dC
    S = -sum(p*np.log(p))
    Sigma = S + k_star*np.log(mean(C))
```

Verificación de conservación: `np.std(Sigma)/np.mean(Sigma) < 0.01`.

---

#### **B.11 Hacia métricas FRC estandarizadas**

Índices propuestos:

* **Índice-FRC (FRC-I):** varianza de $\Sigma$ normalizada (estabilidad de reciprocidad).
* **Eficiencia de Resonancia (RE):** pico de $\\eta_C$ en $\\alpha \approx 0$.
* **Flujo de Coherencia (CF):** total $dC/dt$ integrado sobre el dominio.

Publicar estas métricas con datos permitiría la comparación entre laboratorios.

---

#### **B.12 Resumen**

| Categoría | Propósito |
| :--- | :--- |
| Ecuaciones | implementar reciprocidad y ARF |
| Parámetros | $\\alpha$, $\\beta$, $\\gamma$, $k_*$ controlan retroalimentación |
| Objetivo de simulación | conservar $\Sigma$ dentro del 1% |
| Validación | verificar relación lineal $S$ – $\\ln C$ |
| Resultado | evidencia inter-dominio de universalidad |

---
