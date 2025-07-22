"use client";

export default function ResourcesLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#09111f] text-white relative overflow-hidden px-4 py-36">
      {/* Floating Accents */}
      <div className="absolute top-10 left-10 w-6 h-6 bg-[#ca6678] rounded-full animate-ping opacity-30" />
      <div className="absolute bottom-20 right-20 w-8 h-8 bg-[#fcbf5b] rounded-full animate-ping opacity-20" />

      {/* Glowing Background Ring */}
      <div className="absolute inset-0 flex items-center justify-center z-0">
        <div className="w-72 h-72 rounded-full bg-gradient-to-tr from-[#ca6678] to-[#fcbf5b] blur-3xl opacity-10" />
      </div>

      {/* Main Content */}
      <div className="z-10 text-center space-y-6">
        {/* Gradient Spinner */}
        <div className="w-20 h-20 border-[6px] border-transparent border-t-gradient rounded-full animate-spin mx-auto" />

        <div>
          <h2 className="text-3xl font-bold animate-pulse tracking-wide">
            Preparing Your Content...
          </h2>
          <p className="text-gray-400">
            Unleashing the power of AI & creativity. Hang tight.
          </p>
        </div>
      </div>

      {/* Custom Gradient Border Top */}
      <style jsx>{`
        .border-t-gradient {
          border-top: 6px solid;
          border-image: linear-gradient(to right, #ca6678, #fcbf5b) 1;
        }
      `}</style>
    </div>
  );
}
