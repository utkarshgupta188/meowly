import { cn } from "@/lib/utils";

interface SkeletonProps {
    className?: string;
}

export const Skeleton = ({ className }: SkeletonProps) => {
    return (
        <div className={cn(
            "animate-pulse bg-white/5 rounded-md overflow-hidden relative",
            className
        )}>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
        </div>
    );
};

export const MovieCardSkeleton = () => {
    return (
        <div className="space-y-3">
            <Skeleton className="aspect-[2/3] rounded-2xl w-full" />
            <div className="space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
            </div>
        </div>
    );
};

export const SectionSkeleton = () => {
    return (
        <div className="space-y-6 px-4 md:px-12 py-8">
            <Skeleton className="h-8 w-48" />
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 md:gap-6">
                {[...Array(6)].map((_, i) => (
                    <MovieCardSkeleton key={i} />
                ))}
            </div>
        </div>
    );
};

export const MovieRowSkeleton = () => {
    return (
        <div className="space-y-4 px-4 sm:px-8 md:px-12 py-4">
            <Skeleton className="h-7 w-48 mb-6" />
            <div className="flex space-x-4 overflow-hidden">
                {[...Array(8)].map((_, i) => (
                    <div key={i} className="flex-none w-[160px] md:w-[220px]">
                        <Skeleton className="aspect-[2/3] rounded-2xl w-full mb-3" />
                        <Skeleton className="h-4 w-3/4 mb-2" />
                        <Skeleton className="h-3 w-1/2" />
                    </div>
                ))}
            </div>
        </div>
    );
};
