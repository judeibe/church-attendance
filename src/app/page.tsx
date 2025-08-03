import { AuthCard } from "@/components/auth/auth-card"

export default function Home() {
  return (
    <main className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="w-full max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Hero Section */}
          <div className="text-center md:text-left">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Church Attendance Tracker
            </h1>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              A simple and secure solution for church leaders to track attendance, 
              view reports, and manage their congregation&apos;s participation.
            </p>
            <div className="space-y-4 text-left">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-gray-700">Easy attendance marking for multiple services</p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-gray-700">Detailed reports and analytics</p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-gray-700">Mobile-friendly design for on-the-go access</p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-gray-700">Secure authentication for church staff</p>
              </div>
            </div>
          </div>

          {/* Authentication Card */}
          <div className="w-full">
            <AuthCard />
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-16 text-center text-gray-500 text-sm">
          <p>&copy; 2024 Church Attendance Tracker. Built for church communities.</p>
        </footer>
      </div>
    </main>
  )
}
