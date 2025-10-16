import Image from 'next/image';

export const StrataTracLogo = ({ size = 'medium', className = '' }: { size?: 'small' | 'medium' | 'large', className?: string }) => {
  const dimensions = {
    small: 120,
    medium: 180,
    large: 240
  };
  
  const width = dimensions[size];
  const height = width * 0.4; // Maintain aspect ratio
  
  return (
    <div className={`flex items-center ${className}`}>
      <Image
        src="/images/logo.png"
        alt="StrataTrac Logo"
        width={width}
        height={height}
        priority
        className="object-contain"
      />
    </div>
  );
};
