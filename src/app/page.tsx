export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6">
      <div className="max-w-2xl text-center">
        <h1 className="text-4xl font-light text-frc-gold mb-4">
          Fractal Resonance Coherence
        </h1>
        <p className="text-frc-text-dim text-lg mb-8">
          A research platform exploring the relationship between coherence, entropy, and consciousness.
        </p>
        <div className="inline-block border border-frc-blue rounded-lg px-6 py-4 text-left font-mono text-sm">
          <p className="text-frc-text-dim mb-1">// Core invariant (FRC 566.001)</p>
          <p className="text-frc-text">
            dS + k<span className="text-frc-gold">*</span> d ln C = 0
          </p>
        </div>
        <p className="text-frc-steel text-sm mt-12">
          v2-foundation — under construction
        </p>
      </div>
    </main>
  );
}
