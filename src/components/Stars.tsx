export function Stars({ value, max = 5 }: { value: number; max?: number }) {
  return (
    <span className="stars" aria-label={`${value} out of ${max} stars`}>
      {Array.from({ length: max }).map((_, i) => (
        <span key={i} className={i < value ? 'star filled' : 'star'}>
          ★
        </span>
      ))}
    </span>
  );
}
