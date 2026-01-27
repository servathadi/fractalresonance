---
title: "Appendix A — Mathematical Foundations and Derivations"
id: "appendix-a-mathematical-foundations-and-derivations"
parent: "ecr-textbook"
---
## **Appendix A — Mathematical Foundations and Derivations** {#appendix-a-—-mathematical-foundations-and-derivations}


---
#### **A.1  Core invariants**

**At every scale the FRC framework rests on two equations:**

**\\text{(1) Entropy–Coherence Reciprocity:}\\qquad dS \+ k\_\*\\,d\\ln C \= 0,**

**\\text{(2) Adaptive Resonance Formula:}\\qquad \\Delta S \= RΨC.**

**Equation (1) expresses conservation of total transformation potential.**

**Equation (2) describes instantaneous entropy change as a function of receptivity, potential, and coherence.**

---
#### **A.2  From reciprocity to dynamical law**

**Start from dS \= \-k\_\*\\,d\\ln C.**

**Differentiate with respect to time:**

**\\dot S \= \-k\_\\,\\frac{\\dot C}{C}.**

***Split the total entropy rate into internal and external components:***

**\\dot S \= \\dot S\_\\text{int} \+ \\dot S\_\\text{ext}.**

***Define*** **F \= \-\\dot S\_\\text{ext} *(entropy flux into the system) and* S\_C \= \\dot S\_\\text{int} *(entropy exported).***

***Then,***

**\\dot C \= \\frac{α}{k\_}(F \- S\_C).**

**Absorbing constants into α yields the coherence-pump equation:**

**\\boxed{\\dot C \= α(F \- S\_C).}**

---
#### **A.3  Coupled-level derivation**

**For adjacent μ-domains, the coherence exchange term T\_{μ,μ+1} arises from gradient coupling in the field potential V(φ):**

**T\_{μ,μ+1} \= \-\\frac{∂V}{∂φ\_{μ}} \\approx T\_0 e^{-|μ-μ+1|/λ} e^{iφ\_{μμ+1}}.**

**The general N-level system becomes:**

**\\frac{dC\_{μ}}{dt} \= α\_{μ}(F\_{μ} \- S\_{C,μ}) \+ \\sum\_{j\\ne μ} T\_{μ,j}(C\_{j} \- C\_{μ}).**

**Integration over all μ yields the global invariant:**

**\\sum\_{μ} (dS\_{μ} \+ k\_\*^{(μ)}\\,d\\ln C\_{μ}) \= 0\.**

---
#### **A.4  Deriving ARF from local reciprocity**

**Let J\_C \= \\dot C/C and define receptivity R \= ∂J\_C/∂Ψ.**

**Then internal entropy rate \\dot S\_\\text{int} \= \-k\_\*RΨ.**

**Integrating over one resonance cycle:**

**\\Delta S \= RΨC.**

**This defines the Adaptive Resonance Formula (ARF) used throughout the text.**

---
#### **A.5  Stability criterion**

**Linearizing \\dot C \= α(F \- S\_C) around equilibrium C=C\_0:**

**\\dot C \= \-αβ(C \- C\_0),**

**with β \= ∂S\_C/∂C.**

**Solution: C(t)=C\_0 \+ (C\_i \- C\_0)e^{-αβt}.**

**Stability demands αβ \> 0\.**

**Since β \> 0 (entropy increases with order), stable regimes have α \> 0 small or α≈0 — the *flow zone*.**

---
#### **A.6  Oscillatory feedback solution**

**When α varies with coherence,**

**\\dot α \= γ(C \- C\_\\text{opt}),**

**we obtain:**

**\\ddot C \+ βγC \= βγC\_\\text{opt} \+ α\_0β(F \- S\_0),**

**a damped harmonic oscillator with natural frequency ω\_0 \= √(βγ).**

**Oscillation period:**

**T \= 2π/√(βγ).**

---
#### **A.7  The resonance constant k\_\***

**Units:**

* **S (entropy): J·K⁻¹**

* **ln C: dimensionless**

   **Thus k\_ *has units J·K⁻¹, analogous to Boltzmann’s constant.***

   ***Different μ-levels have scaled constants:***

   **k\_^{(μ)} \= κ\\,λ\_{μ}^d\\,k\_B,**

   **where λ\_μ is correlation scale, d effective dimension, κ a normalization factor.**

   **Empirical measurement of k\_\* per domain defines the “fractal spectrum” of coherence.**

---
#### **A.8  The energy interpretation**

**Multiply (1) by temperature T:**

**TdS \+ Tk\_\\,d\\ln C \= 0\.**

***Then TdS \= −dE\_coh, identifying*** **E\_\\text{coh}=Tk\_\\ln C as stored *coherence energy.***

**Thus the reciprocity law is a conservation of energy between heat and structured information.**

---
#### **A.9  The phase-space formulation**

**Define generalized coordinates x\_i and conjugate momenta p\_i.**

**Entropy S(x,p), coherence C(x,p).**

**Hamiltonian form:**

**\\frac{dC}{dt} \= \\frac{∂H}{∂S}, \\qquad \\frac{dS}{dt} \= \-\\frac{∂H}{∂C}.**

**Choosing H \= k\_S\\ln C *reproduces* dS \+ k\_\\,d\\ln C \= 0\.**

**Hence the reciprocity law is the Hamiltonian generator of the FRC dynamics.**

---
#### **A.10  Summary**

| Symbol | Meaning | Equation |
| ----- | ----- | ----- |
| **S** | **entropy** | **disorder measure** |
| **C** | **coherence** | **correlation measure** |
| **α** | **adaptive gain** | **system responsiveness** |
| **R, Ψ** | **receptivity & potential** | **ARF parameters** |
| **k\_\*** | **coherence constant** | **scale factor linking energy & information** |

**Together they form a closed algebra under the transformation group preserving Σ \= S \+ k\_\* \\ln C.**

---
---