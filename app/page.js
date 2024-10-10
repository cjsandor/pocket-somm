import Link from 'next/link'

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">Welcome to Bottle Analyzer</h1>
      <p className="mb-4">Upload a photo of an alcohol bottle label to get detailed information.</p>
      <Link 
        href="/upload" 
        className="inline-block bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out"
      >
        Start Analyzing
      </Link>
    </div>
  )
}