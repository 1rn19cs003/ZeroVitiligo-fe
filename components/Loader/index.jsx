// components/Loader.jsx
import React from 'react';

export default function Loader({ size = 48, color = '#2563eb', message = 'Loading...' }) {
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
        backgroundColor: 'rgba(255, 255, 255, 0.7)', 
      }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        style={{ display: 'block' }}
        width={size}
        height={size}
        viewBox="0 0 100 100"
        preserveAspectRatio="xMidYMid"
      >
        <circle
          cx="50"
          cy="50"
          fill="none"
          stroke={color}
          strokeWidth="10"
          r="35"
          strokeDasharray="164.93361431346415 56.97787143782138"
          transform="rotate(276.919 50 50)"
        >
          <animateTransform
            attributeName="transform"
            type="rotate"
            repeatCount="indefinite"
            dur="1s"
            values="0 50 50;360 50 50"
            keyTimes="0;1"
          />
        </circle>
      </svg>
      {message && (
        <p style={{ color, marginTop: 10, fontSize: size / 4, userSelect: 'none' }}>
          {message}
        </p>
      )}
    </div>
  );
}
