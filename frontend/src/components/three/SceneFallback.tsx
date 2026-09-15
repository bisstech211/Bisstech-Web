/**
 * DOM-only fallback shown while the WebGL hero scene lazy-loads.
 * Kept dependency-free (no three.js) so it can be imported statically
 * without pulling the 3D bundle into the main chunk.
 */
export function SceneFallback() {
  return (
    <div
      aria-hidden
      className="absolute inset-0 flex items-center justify-center"
      style={{
        background: 'radial-gradient(60% 50% at 50% 55%, rgba(229,9,20,0.10), transparent 70%)',
      }}
    />
  );
}