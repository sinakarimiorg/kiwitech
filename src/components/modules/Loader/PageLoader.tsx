import Loader from './Loader'

export default function PageLoader() {
    return (
        <div className="flex-center w-full min-h-[60vh] py-24">
            <div className="flex flex-col items-center gap-4">
                <Loader size="lg" />
                <span className="text-sm text-zinc-400">در حال بارگذاری...</span>
            </div>
        </div>
    )
}
