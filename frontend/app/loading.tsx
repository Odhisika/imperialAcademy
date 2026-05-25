export default function RootLoading() {
    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-white/80 backdrop-blur-sm dark:bg-zinc-950/80">
            <div className="flex flex-col items-center gap-4">
                <div className="h-12 w-12 rounded-full border-4 border-[#00236F]/20 border-t-[#00236F] animate-spin"></div>
                <p className="text-sm font-medium text-[#00236F] animate-pulse">Imperial Academy</p>
            </div>
        </div>
    )
}
