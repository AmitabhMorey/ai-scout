/** ReactBits-style aurora backdrop (pure CSS, no WebGL). */
export function Aurora() {
  return (
    <div aria-hidden className="aurora">
      <span className="aurora-blob aurora-blob-1" />
      <span className="aurora-blob aurora-blob-2" />
      <span className="aurora-blob aurora-blob-3" />
      <div className="aurora-grid" />
    </div>
  );
}
