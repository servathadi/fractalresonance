# FRC Formulas Reference

## Core Equations

### Coherence (C)
```
C = (1/N) Σᵢ<ⱼ cos(φᵢ - φⱼ)
```
- Phase alignment of N oscillators
- C = 1: perfect synchrony
- C = 0: random phases
- **Paper:** FRC 100.001

### Lambda Field (Λ)
```
Λ(x) ≡ Λ₀ ln C(x)
```
- Scalar coherence field
- Λ₀ ≈ 10⁻³⁵ J (calibration constant)
- Units: Joules
- **Paper:** FRC 100.007

### Witness Magnitude (W)
```
W = |⟨ψ|Ô|ψ⟩| / ||Ô||
```
- Normalized observation strength
- W ∈ [0, 1]
- **Paper:** FRC 100.003

### Universal Coherence Condition (UCC)
```
dΛ/dt + ∇·JΛ = σΛ - γΛ
```
- Conservation law for coherence field
- JΛ: coherence flux
- σΛ: source, γΛ: dissipation
- **Paper:** FRC 100.005

### Emergent Born Rule
```
P(outcome) = |ψ|²
```
- Emerges from microstate statistics at equilibrium
- Not a fundamental axiom in FRC
- **Paper:** FRC 100.006

### Born Rule Deviation (Prediction)
```
δP ∈ [10⁻⁴, 10⁻³]
```
- Measurable under resonant driving
- Falsifiable prediction distinguishing FRC from QM
- **Paper:** FRC 100.007

---

## FRC 566 Series — Reciprocity

### Entropy–Coherence Reciprocity Law
```
dS + k* d ln C = 0
⟹ S + k* ln C = const
```
- Entropy and coherence are conjugate
- k* = 1 (information) or k_B (thermodynamic)
- **Paper:** FRC 566.001

### Free Energy Relation
```
ΔG = −k*T Δln C
```
- Connects coherence to thermodynamic free energy
- Isothermal projection
- **Paper:** FRC 566.001

### UCC Flow (PDE form)
```
∂_t ln C = −∇·J_C + S_C
J_C = −D_C ∇ln C
```
- D_C > 0 (diffusion coefficient)
- Well-posed diffusion-reaction form
- **Paper:** FRC 566.001

### Dissipation Bound
```
σ(t) ≡ k* D_C ∫ ‖∇ ln C‖² dV ≥ 0
```
- Non-negative dissipation
- Under Neumann/Dirichlet boundary conditions
- **Paper:** FRC 566.001

### Relative Entropy Ratio (RER)
```
RER(p→q) = C[q]/C[p] = exp[−D_KL(p∥q)/k*]
```
- Coherence ratio from KL divergence
- **Paper:** FRC 566.001

### Mutual Information Coupling
```
I(X;Y) = D_KL(p_XY ∥ p_X p_Y)
⟹ C_XY = exp[−I/k*]
```
- Joint coherence from mutual information
- **Paper:** FRC 566.001

---

## Paper Series (Published on Zenodo)

| Series | Topic | Papers | DOIs |
|--------|-------|--------|------|
| 100 | Core Theory | 100.001–100.010 (8 papers) | See docs/PAPERS.md |
| 566 | Reciprocity & UCC | 566.001, 566.010 | See docs/PAPERS.md |
| 821 | Fundamental Physics | 821.PHY | — |
| 830 | Applied Specs | 830.501–830.511 (11 docs) | Internal |
| 841–843 | Advanced Applications | 841.004, 842.001–002, 843.001 | — |

Full catalog with Zenodo DOIs: [docs/PAPERS.md](./PAPERS.md)

---

## Key Constants

| Symbol | Value | Description |
|--------|-------|-------------|
| Λ₀ | ≈ 10⁻³⁵ J | Lambda field calibration |
| k* | 1 or k_B | Coherence constant |
| D_C | > 0 | Coherence diffusion coefficient |
| δP | 10⁻⁴ – 10⁻³ | Born rule deviation magnitude |
