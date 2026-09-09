import React from 'react';

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  variant?: 'rectangular' | 'circular' | 'rounded';
}

export function Skeleton({
  className = '',
  variant = 'rounded',
  ...props
}: SkeletonProps) {
  const variantClasses = {
    rectangular: '',
    circular: 'rounded-full',
    rounded: 'rounded-2xl',
  };

  return (
    <div
      className={`animate-pulse bg-stone-200/70 ${variantClasses[variant]} ${className}`}
      {...props}
    />
  );
}

export interface ImpactStoryCardSkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

export const ImpactStoryCardSkeleton: React.FC<ImpactStoryCardSkeletonProps> = ({ className = '', ...props }) => {
  return (
    <div
      className={`bg-white rounded-[2rem] border border-stone-200/80 overflow-hidden shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] flex flex-col ${className}`}
    >
      {/* Image Skeleton */}
      <div className="aspect-[4/3] w-full relative bg-stone-200/80 animate-pulse">
        <div className="absolute top-4 left-4">
          <div className="h-6 w-28 rounded-full bg-charcoal/30 animate-pulse" />
        </div>
      </div>

      {/* Content Skeleton */}
      <div className="p-8 flex-grow flex flex-col justify-between">
        <div className="space-y-4">
          {/* Title */}
          <div className="h-6 w-3/4 bg-stone-200/80 rounded-lg animate-pulse" />

          {/* Summary lines */}
          <div className="space-y-2 pt-2">
            <div className="h-4 w-full bg-stone-200/60 rounded animate-pulse" />
            <div className="h-4 w-5/6 bg-stone-200/60 rounded animate-pulse" />
            <div className="h-4 w-2/3 bg-stone-200/60 rounded animate-pulse" />
          </div>

          {/* Quote block placeholder */}
          <div className="p-4 bg-canvas/60 rounded-xl border-l-2 border-gold/40 space-y-2 mt-4">
            <div className="h-3 w-4/5 bg-stone-200/70 rounded animate-pulse" />
            <div className="h-3 w-1/3 bg-stone-200/50 rounded animate-pulse" />
          </div>
        </div>

        {/* Action button placeholder */}
        <div className="pt-6 space-y-4">
          <div className="h-4 w-24 bg-stone-200/60 rounded mx-auto sm:mx-0 animate-pulse" />
          <div className="h-12 w-full max-w-xs mx-auto bg-charcoal/20 rounded-xl animate-pulse" />
        </div>
      </div>
    </div>
  );
}

export function SkeletonLoader({
  count = 3,
  className = '',
}: {
  count?: number;
  className?: string;
}) {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 ${className}`}>
      {Array.from({ length: count }).map((_, index) => (
        <ImpactStoryCardSkeleton key={`skeleton-${index}`} />
      ))}
    </div>
  );
}

export default SkeletonLoader;
