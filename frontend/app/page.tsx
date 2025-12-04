export default function Home() {
  return (
    <main className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-4">CarIn</h1>
        <p className="text-xl text-gray-600 mb-8">
          Decentralized parking spot booking on Celo blockchain
        </p>
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-semibold mb-4">Welcome to CarIn</h2>
          <p className="text-gray-700">
            Connect your wallet to start booking parking spots or list your own.
          </p>
        </div>
      </div>
    </main>
  );
}

