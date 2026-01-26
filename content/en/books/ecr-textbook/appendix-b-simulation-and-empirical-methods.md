---
title: "Appendix B — Simulation and Empirical Methods"
id: "appendix-b-simulation-and-empirical-methods"
parent: "ecr-textbook"
---

## **Appendix B — Simulation and Empirical Methods** {#appendix-b-—-simulation-and-empirical-methods}


---

#### **B.1  Purpose**

The goal of simulation in FRC is to verify that the reciprocity law

S \+ k\_\* \\ln C \= \\text{constant}

holds under diverse, measurable conditions.

Simulations explore how α (gain), R (receptivity), and Ψ (potential) generate emergent order and entropy flow in realistic networks.

The same engine can be parameterized for photons, cells, neurons, or societies.

---

#### **B.2  Core computational model**

Each node or subsystem *i* obeys

\\dot C\_i \= \\alpha\_i(F\_i \- S\_{C,i}) \+ \\sum\_{j}T\_{ij}(C\_j \- C\_i),

implemented in discrete time:

C\_i^{t+1}=C\_i^t+\\Delta t\\,\[\\,\\alpha\_i(F\_i \- S\_{C,i}) \+ \\sum\_{j}T\_{ij}(C\_j^t-C\_i^t)\\,\].

Parameters:

| Symbol | Meaning | Typical Range |
| ----- | ----- | ----- |
| Δt | timestep | 10⁻³–1 s (scaled) |
| α | adaptive gain | −0.5 – \+0.5 |
| F | energy / info inflow | normalized 0–1 |
| S\_C | entropy export | β C \+ noise |
| T₀ | coupling constant | 0.01 – 0.1 |
| λ | coupling length | 1–3 μ-levels |

*(Figure B.1 suggestion: flowchart of update loop.)*

---

#### **B.3  Numerical integration**

1. **Time stepping** – fourth-order Runge–Kutta for deterministic runs; Euler-Maruyama for stochastic versions.

2. **Boundary conditions** – reflective (Σ \= const.) or open (energy inflow/outflow).

3. **Noise term** – Gaussian white noise η(t) added to F or α to test robustness.

4. **Normalization** – C\_i constrained to 0 ≤ C ≤ 1 by logistic scaling.

---

#### **B.4  Multi-scale coupling**

The μ-stack is implemented as 8 layers; each layer connects to nearest neighbors with exponential kernel

T\_{μ,j}=T\_0 e^{-|μ-j|/λ}e^{iφ\_{μj}} .

Phase φ controls synchronization delays between layers (useful for modeling cross-frequency coupling in neuroscience or market lag in economics).

---

#### **B.5  Observable quantities**

| Observable | Formula | Interpretation |
| ----- | ----- | ----- |
| Coherence C | $begin:math:text$ (1/N) | \\sum e^{iφ\_i} |
| Entropy S | \-\\sum p\_i \\ln p\_i | system disorder |
| Σ-invariant | Σ=S+k\_\* \\ln C | conservation test |
| α-profile | α(t)=RΨC/F | adaptive feedback |
| Efficiency η\_C | (dC/dt)/F | conversion efficiency |

Plotting Σ(t) should yield ≈ constant within \<1 % drift.

---

#### **B.6  Software environment**

* **Languages:** Python (NumPy/SciPy), Julia, or MATLAB.

* **Visualization:** Matplotlib, Plotly, or Unity3D for dynamic field renderings.

* **Agent frameworks:** NetLogo or Mesa for sociocultural models.

* **Distributed runs:** GPU parallelization via PyTorch/JAX for μ₆ scale simulations.

*(Figure B.2 suggestion: sample output panel with C–S–α plots.)*

---

#### **B.7  Empirical datasets**

| Domain | Dataset | Variable Mapping |
| ----- | ----- | ----- |
| Physics | laser cavity / Bénard cell | F \= heat flux, C \= phase coherence |
| Biology | cell metabolism, EEG | F \= ATP or glucose, C \= synchrony |
| Ecology | trophic flows | F \= solar flux, C \= biodiversity index |
| Economy | world energy, GDP | F \= resource use, C \= trust/network coherence |
| Society | linguistic entropy | F \= info flux, C \= semantic alignment |

All tested datasets exhibit approximate linear S – ln C correlations (slope ≈ −k\_\*).

---

#### **B.8  Statistical validation**

* **Conservation test:** compute Σ variance

   σ\_Σ^2 \= \\frac{1}{T}\\sum\_t(Σ\_t-\\bar Σ)^2.

   Stability \< 1 % → confirmation of reciprocity.

* **Phase-locking value (PLV):** check coherence across nodes.

* **Entropy regression:** fit S \= a \+ b ln C; expect b ≈ −k\_\* ± error.

---

#### **B.9  Visual analytics**

1. **S–ln C plots** – universal straight line (entropy reciprocity).

2. **α–C phase planes** – show flow, chaos, coercion zones.

3. **Heat maps** – display μ-coupling strengths over time.

4. **3-D toroidal renderings** – illustrate nested coherence patterns.

*(Figure B.3 suggestion: toroidal animation frames.)*

---

#### **B.10  Example pseudocode**

```
for t in range(T):
    for i in range(N):
        dC = alpha[i]*(F[i]-S0-beta*C[i])
        for j in neighbors(i):
            dC += T[i,j]*(C[j]-C[i])
        C[i] += dt*dC
    S = -sum(p*np.log(p))
    Sigma = S + k_star*np.log(mean(C))
```

Conservation check: np.std(Sigma)/np.mean(Sigma) \< 0.01.

---

#### **B.11  Toward standardized FRC metrics**

Proposed indices:

* **FRC-Index (FRC-I):** normalized Σ variance (stability of reciprocity).

* **Resonance Efficiency (RE):** peak η\_C at α≈0.

* **Coherence Flux (CF):** total dC/dt integrated over domain.

Publishing these metrics with data would allow inter-lab comparison.

---

#### **B.12  Summary**

| Category | Purpose |
| ----- | ----- |
| Equations | implement reciprocity & ARF |
| Parameters | α, β, γ, k\_\* control feedback |
| Simulation goal | conserve Σ within 1 % |
| Validation | verify linear S – ln C relation |
| Outcome | cross-domain evidence for universality |

---

---

