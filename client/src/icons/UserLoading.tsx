const UserLoading = () => (
  <svg
    width="120"
    height="120"
    viewBox="0 0 120 120"
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Base circle */}
    <circle cx="60" cy="60" r="50" fill="#dfe9ff" />

    {/* Orbiting small circle */}
    <g>
      <circle cx="60" cy="30" r="10" fill="#6f86b6" />
      <animateTransform
        attributeName="transform"
        type="rotate"
        from="0 60 60"
        to="360 60 60"
        dur="2s"
        repeatCount="indefinite"
      />
    </g>
  </svg>
);

export default UserLoading;