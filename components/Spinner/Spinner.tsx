import { FC } from "react";

interface SpinnerProps {
  size?: number;
}

const Spinner: FC<SpinnerProps> = ({ size = 300 }) => {
  return (
    <div className="flex justify-center items-center">
      <svg
        data-testid="spinner-svg"
        className="animate-spin"
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle
          cx="50"
          cy="50"
          r="45"
          fill="#FFD700"
          stroke="#FFA500"
          strokeWidth="5"
        />
        <circle cx="35" cy="35" r="6" fill="#FF6347" />
        <circle cx="65" cy="40" r="6" fill="#FF6347" />
        <circle cx="50" cy="65" r="6" fill="#FF6347" />
        <path
          d="M50 50 L90 50"
          stroke="#FFA500"
          strokeWidth="5"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
};

export default Spinner;
