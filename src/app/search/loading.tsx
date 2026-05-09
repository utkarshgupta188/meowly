import { SectionSkeleton } from "@/components/Skeleton";

export default function SearchLoading() {
    return (
        <main className="min-h-screen bg-black">
            <div className="pt-40 md:pt-32">
                <SectionSkeleton />
                <SectionSkeleton />
            </div>
        </main>
    );
}
