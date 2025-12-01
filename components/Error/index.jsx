export default function ErrorMessage({ message = 'An error occurred.', color = '#dc2626', icon = true }) {
  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.85)',
        color,
        fontSize: 18,
        fontWeight: '600',
        zIndex: 9999,
        padding: 20,
        textAlign: 'center',
        userSelect: 'none',
      }}
      role="alert"
      aria-live="assertive"
    >
      {icon && (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke={color}
          strokeWidth={2}
          style={{ width: 48, height: 48, marginBottom: 12 }}
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M12 17a7 7 0 100-14 7 7 0 000 14z" />
        </svg>
      )}
      <p>{message}</p>
    </div>
  );
}
