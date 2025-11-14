import { Image } from '@/components/ui/image';

interface LoadingSpinnerProps {
  message?: string;
  className?: string;
  spinnerClassName?: string;
}

export function LoadingSpinner({
  message = "Loading...",
  className = "min-h-screen flex flex-col items-center justify-center bg-background",
  spinnerClassName = "animate-spin rounded-full h-8 w-8 border-b-2 border-primary"
}: LoadingSpinnerProps) {
  return (
    <div className={className}>
      {/* VTU Logo at the top center - slightly larger */}
      <div className="mb-16 flex justify-center">
        <Image 
          src="https://static.wixstatic.com/media/e79745_05a9ee90999948aca94486957d7c72e5~mv2.jpg"
          alt="VTU Consortium Logo"
          width={250}
          className="w-56 h-auto object-contain max-w-full"
        />
      </div>
      
      {/* Loading spinner and message */}
      <div className="flex items-center space-x-6">
        <div className={spinnerClassName}></div>
        <span className="text-lg text-foreground/70 font-paragraph">{message}</span>
      </div>
    </div>
  );
}
