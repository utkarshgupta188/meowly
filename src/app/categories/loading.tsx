import { SectionSkeleton } from "@/components/Skeleton";
import Navbar from "@/components/Navbar";

export default function CategoriesLoading() {
    return (
        <main className="min-h-screen bg-black">
            <Navbar />
            <div className="pt-40 md:pt-32">
                <SectionSkeleton />
            </div>
        </main>
    );
}
