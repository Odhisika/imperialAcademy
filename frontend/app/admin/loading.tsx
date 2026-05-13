import { Spinner } from "@/components/ui/spinner"

export default function AdminLoading() {
    return (
        <div className="flex h-[70vh] w-full flex-col items-center justify-center gap-4">
            <div className="relative">
                <div className="h-16 w-16 rounded-full border-4 border-[#00236F]/10 border-t-[#00236F] animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="h-8 w-8 rounded-full bg-[#00236F]/5"></div>
                </div>
            </div>
            <div className="flex flex-col items-center gap-1">
                <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">Loading Dashboard</h3>
                <p className="text-sm text-zinc-500 animate-pulse">Fetching your data...</p>
            </div>
        </div>
    )
}
