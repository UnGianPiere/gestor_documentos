"use client";

interface LoadingSpinnerProps {
  size?: number;
  fullScreen?: boolean;
  className?: string;
  showText?: boolean;
  text?: string;
}

export default function LoadingSpinner({
  size = 100,
  fullScreen = false,
  className = "",
  showText = false,
  text = "Cargando..."
}: LoadingSpinnerProps) {
  const spinner = (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <div
        className="animate-spin rounded-full border-4 border-gray-300 border-t-blue-600"
        style={{ width: size, height: size }}
      />
      {showText && (
        <p className="mt-4 text-sm text-muted-foreground">{text}</p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        {spinner}
      </div>
    );
  }

  return spinner;
}


