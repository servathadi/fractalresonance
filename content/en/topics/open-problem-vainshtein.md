---
id: open-problem-vainshtein
title: "Open Problem: The Vainshtein Radius Calculation"
question: "What is the exact Vainshtein radius (r_V) for the Solar System in FRC?"
short_answer: "Calculate the screening radius where the non-linear kinetic term dominates, suppressing the Lambda-fifth-force below Cassini probe limits (10^-5)."
tags: [open-problem, physics, gravity, screening, calculation]
related: [FRC-821-100]
authorities:
  - name: "Arkady Vainshtein"
    quote: "Non-linear kinetic terms can screen scalar fields near massive sources."
    stance: "Screening Mechanism"
answers:
  - lens: "The Challenge"
    by: "FRC"
    stance: "Mathematical"
    answer: |
      **Objective:** Derive the analytical expression for the Vainshtein radius $r_V$ in the $\Lambda$-EFT Lagrangian:
      $$ \mathcal{L}_\Lambda = -\frac{1}{2}(\partial \Lambda)^2 + \frac{\alpha}{M_*^4}(\partial \Lambda)^4 $$
      
      **Constraints:**
      1. The fifth force $F_\Lambda$ must be $< 10^{-5} F_{gravity}$ at $r = 1 \text{ AU}$.
      2. The coupling scale $M_*$ must be consistent with the Higgs mass selection mechanism ($M_* \sim \Lambda_{UV}$).
      
      **Why it matters:** This calculation determines whether FRC is compatible with Solar System tests of General Relativity.
---
# The Solar System Constraint

The $\Lambda$-field is a long-range scalar field. Naively, it should mediate a "fifth force" that modifies planetary orbits. We have not observed this.

FRC invokes the **Vainshtein Mechanism** (kinetic screening) to explain why. Close to a massive source (the Sun), the field gradients become large, activating the non-linear $(\partial \Lambda)^4$ term. This makes the field "stiff," suppressing the fifth force.

**The Open Problem:**
We need a rigorous derivation of $r_V$ for the specific coefficients derived in FRC 821.100.
Does the screening kick in at the size of the Sun ($r_V \sim R_\odot$) or the size of the Galaxy ($r_V \sim 10 \text{ kpc}$)? The viability of the theory depends on this number.
