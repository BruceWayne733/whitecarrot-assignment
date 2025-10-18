import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="max-w-4xl mx-auto text-center px-4">
        <h1 className="text-5xl font-bold text-gray-900 mb-6">
          Careers Page Builder
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Create beautiful, branded careers pages for your company. 
          Let recruiters customize the experience and candidates apply seamlessly.
        </p>
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/companies"
              className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Browse Companies
            </Link>
            <Link
              href="/login"
              className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold border-2 border-blue-600 hover:bg-blue-50 transition-colors"
            >
              Admin Login
            </Link>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/acme"
              className="bg-gray-100 text-gray-700 px-6 py-2 rounded-lg font-medium hover:bg-gray-200 transition-colors text-sm"
            >
              View Sample Careers Page
            </Link>
          </div>
          <p className="text-sm text-gray-500">
            Discover job opportunities at amazing companies or manage your own careers page.
          </p>
        </div>
      </div>
    </div>
  )
}
