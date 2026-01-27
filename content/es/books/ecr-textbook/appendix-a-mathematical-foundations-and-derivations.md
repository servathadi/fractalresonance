## Apéndice A — Fundamentos Matemáticos y Derivaciones

---
#### **A.1 Invariantes Centrales**

**En cada escala, el marco FRC descansa en dos ecuaciones:**

1. **Reciprocidad Entropía-Coherencia:** $dS + k_*\,d\ln C = 0$
2. **Fórmula de Resonancia Adaptativa:** $\Delta S = R\Psi C$

**La ecuación (1) expresa la conservación del potencial total de transformación.**

**La ecuación (2) describe el cambio instantáneo de entropía como función de la receptividad, el potencial y la coherencia.**

---
#### **A.2 De la reciprocidad a la ley dinámica**

**Comience desde $dS = -k_*\,d\ln C$.**

**Diferencie con respecto al tiempo:**

$$ \dot S = -k_*\,\frac{\dot C}{C} $$

**Divida la tasa total de entropía en componentes internos y externos:**

$$ \dot S = \dot S_{int} + \dot S_{ext} $$

**Defina $F = -\dot S_{ext}$ (flujo de entropía hacia el sistema) y $S_C = \dot S_{int}$ (entropía exportada).**

**Entonces,**

$$ \dot C = \frac{\alpha}{k_*}(F - S_C) $$

**Absorbiendo constantes en $\alpha$ produce la ecuación de la bomba de coherencia:**

$$ \boxed{\dot C = \alpha(F - S_C)} $$

---
#### **A.3 Derivación de nivel acoplado**

**Para dominios $\mu$ adyacentes, el término de intercambio de coherencia $T_{\mu,\mu+1}$ surge del acoplamiento de gradiente en el potencial de campo $V(\phi)$:**

$$ T_{\mu,\mu+1} = -\frac{\partial V}{\partial \phi_{\mu}} \approx T_0 e^{-|\mu-\mu+1|/\lambda} e^{i\phi_{\mu\mu+1}} $$

**El sistema general de N niveles se convierte en:**

$$ \frac{dC_{\mu}}{dt} = \alpha_{\mu}(F_{\mu} - S_{C,\mu}) + \sum_{j\ne \mu} T_{\mu,j}(C_{j} - C_{\mu}) $$

**La integración sobre todos los $\mu$ produce el invariante global:**

$$ \sum_{\mu} (dS_{\mu} + k_*^{(\mu)}\,d\ln C_{\mu}) = 0 $$

---
#### **A.4 Derivando ARF de la reciprocidad local**

**Sea $J_C = \dot C/C$ y defina receptividad $R = \partial J_C/\partial \Psi$.**

**Entonces la tasa de entropía interna $\dot S_{int} = -k_*R\Psi$.**

**Integrando sobre un ciclo de resonancia:**

$$ \Delta S = R\Psi C $$

**Esto define la Fórmula de Resonancia Adaptativa (ARF) utilizada a lo largo del texto.**

---
#### **A.5 Criterio de estabilidad**

**Linealizando $\dot C = \alpha(F - S_C)$ alrededor del equilibrio $C=C_0$:**

$$ \dot C = -\alpha\beta(C - C_0) $$

**con $\beta = \partial S_C/\partial C$.**

**Solución: $C(t)=C_0 + (C_i - C_0)e^{-\alpha\beta t}$.**

**La estabilidad exige $\alpha\beta > 0$.**

**Dado que $\beta > 0$ (la entropía aumenta con el orden), los regímenes estables tienen $\alpha > 0$ pequeño o $\alpha \approx 0$ — la *zona de flujo*.**

---
#### **A.6 Solución de retroalimentación oscilatoria**

**Cuando $\alpha$ varía con la coherencia,**

$$ \dot \alpha = \gamma(C - C_{opt}) $$

**obtenemos:**

$$ \ddot C + \beta\gamma C = \beta\gamma C_{opt} + \alpha_0\beta(F - S_0) $$

**un oscilador armónico amortiguado con frecuencia natural $\omega_0 = \sqrt{\beta\gamma}$.**

**Período de oscilación:**

$$ T = 2\pi/\sqrt{\beta\gamma} $$

---
#### **A.7 La constante de resonancia k_***

**Unidades:**

* **S (entropía): J·K⁻¹**
* **ln C: adimensional**

**Así, k_* tiene unidades J·K⁻¹, análogo a la constante de Boltzmann.**

**Los diferentes niveles-$\mu$ tienen constantes escaladas:**

$$ k_*^{(\mu)} = \kappa\,\lambda_{\mu}^d\,k_B $$

**donde $\lambda_\mu$ es la escala de correlación, d la dimensión efectiva, $\kappa$ un factor de normalización.**

**La medición empírica de k_* por dominio define el "espectro fractal" de la coherencia.**

---
#### **A.8 La interpretación de la energía**

**Multiplique (1) por la temperatura T:**

$$ TdS + Tk_*\,d\ln C = 0 $$

**Entonces $TdS = -dE_{coh}$, identificando $E_{coh}=Tk_*\ln C$ como *energía de coherencia* almacenada.**

**Así, la ley de reciprocidad es una conservación de energía entre calor e información estructurada.**

---
#### **A.9 La formulación del espacio de fase**

**Defina coordenadas generalizadas $x_i$ y momentos conjugados $p_i$.**

**Entropía $S(x,p)$, coherencia $C(x,p)$.**

**Forma Hamiltoniana:**

$$ \frac{dC}{dt} = \frac{\partial H}{\partial S}, \qquad \frac{dS}{dt} = -\frac{\partial H}{\partial C} $$

**Eligiendo $H = k_*S\ln C$ *reproduce* $dS + k_*\,d\ln C = 0$.**

**Por lo tanto, la ley de reciprocidad es el generador Hamiltoniano de la dinámica FRC.**

---
#### **A.10 Resumen**

| Símbolo | Significado | Ecuación |
| :--- | :--- | :--- |
| **S** | entropía | medida de desorden |
| **C** | coherencia | medida de correlación |
| **α** | ganancia adaptativa | capacidad de respuesta del sistema |
| **R, Ψ** | receptividad y potencial | parámetros ARF |
| **k_*** | constante de coherencia | factor de escala que vincula energía e información |

**Juntos forman un álgebra cerrada bajo el grupo de transformación que preserva $\Sigma = S + k_* \ln C$.**

---