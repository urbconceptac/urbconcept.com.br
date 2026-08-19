type MediaSlotProps = {
  /** CSS hook class from the spec, e.g. "manifesto-img-slot" */
  slotClass: string;
  src: string;
  alt: string;
  width: number;
  height: number;
  label: string;
  ratio?: string;
  className?: string;
};

/**
 * Structural image slot: neutral surface + thin technical border.
 * The <img> is wired to a local path; while the file is absent the slot
 * keeps its dimensions and technical labeling.
 */
export function MediaSlot({
  slotClass,
  src,
  alt,
  width,
  height,
  label,
  ratio,
  className = "",
}: MediaSlotProps) {
  return (
    <div
      className={`image-slot slot-grid ${slotClass} ${className}`}
      style={{ aspectRatio: ratio ?? `${width} / ${height}` }}
    >
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        loading="lazy"
        decoding="async"
        className="absolute inset-0 h-full w-full object-cover grayscale contrast-125"
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background via-background/10 to-transparent" />
      <div className="pointer-events-none absolute inset-0 flex items-end justify-between p-4">
        <span className="label-mono">{label}</span>
        <span className="label-mono">
          {width}×{height}
        </span>
      </div>
      <span className="pointer-events-none absolute left-4 top-4 h-3 w-3 border-l border-t border-border" />
      <span className="pointer-events-none absolute right-4 top-4 h-3 w-3 border-r border-t border-border" />
    </div>
  );
}
