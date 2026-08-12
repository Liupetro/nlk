/**
 * MAX messenger mark — monochrome (currentColor), sized like Lucide icons.
 * Shape based on the official glyph, without brand purple colors.
 */
export function MaxIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
    >
      {/* Official MAX blob mark, scaled into icon well (~same visual weight as Phone/Mail) */}
      <path
        fill="currentColor"
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12.1 20.55c-1.55 0-2.27-.23-3.52-1.13-.79 1.02-3.3 1.81-3.41.45 0-1.02-.23-1.88-.48-2.83-.31-1.16-.65-2.45-.65-4.33C4.04 7.24 7.71 3.88 12.05 3.88c4.35 0 7.76 3.53 7.76 7.87.02 4.28-3.44 7.76-7.71 7.8Zm.06-11.8c-2.12-.11-3.77 1.36-4.13 3.65-.3 1.9.23 4.22.69 4.34.22.05.77-.39 1.11-.74.64.5 1.4.78 1.91.68 2.19.11 4.07-1.56 4.22-3.75.09-2.2-1.6-4.06-3.8-4.18Z"
      />
    </svg>
  );
}
