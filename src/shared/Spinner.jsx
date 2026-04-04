export default function Spinner({ size = 32, color = 'var(--primary)', style = {} }) {
  return (
    <div style={{
      width: size, height: size,
      border: `3px solid var(--border-light)`,
      borderTopColor: color,
      borderRadius: '50%',
      animation: 'spin 0.8s linear infinite',
      ...style
    }} />
  );
}
