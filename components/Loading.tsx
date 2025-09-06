export default function Loading() {
  return (
    <div className="flex h-screen bg-white dark:bg-black text-black dark:text-white">
      <div className="flex-1 flex items-center justify-center">
        <div className="text-blue-600 font-bold text-lg tracking-wider animate-pulse">
          <img src="/INFRAWATCH.gif" alt="meu gif" width={300} height={200} />
        </div>
      </div>
    </div>
  );
}
