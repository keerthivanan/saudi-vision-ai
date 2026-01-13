export default function Loading() {
    return (
        <div className="fixed inset-0 bg-white/80 backdrop-blur-sm z-50 flex items-center justify-center">
            <div className="flex flex-col items-center gap-4">
                <div className="w-16 h-16 border-4 border-slate-200 border-t-emerald-saudi rounded-full animate-spin" />
                <div className="text-emerald-saudi font-bold text-sm animate-pulse">Loading Vision 2030...</div>
            </div>
        </div>
    );
}
