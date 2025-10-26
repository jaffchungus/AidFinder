import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 md:p-24 text-center">
      <div className="glass-card p-6 md:p-8 max-w-md w-full">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">AidFinder</h1>
        <p className="mb-6 md:mb-8 text-gray-800">Connecting people in need with those who can help.</p>
        <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
          <Link href="/need" className="btn bg-blue-500 hover:bg-blue-600">
            I Need Help
          </Link>
          <Link href="/give" className="btn bg-indigo-500 hover:bg-indigo-600">
            I Can Help
          </Link>
        </div>
      </div>
    </main>
  );
}
