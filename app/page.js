import Link from "next/link";

export default function Home() {
  return (
    <main className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-950 text-white">
      <div className="text-center px-4">
        <h1 className="text-5xl md:text-7xl font-bold mb-6">
          Bem-vindo ao <span className="text-primary">Torque</span>
        </h1>
        <p className="text-gray-400 text-lg md:text-xl mb-10">
          Transforme o jeito de administrar sua oficina com tecnologia simples e eficaz.
        </p>
        <div className="flex justify-center gap-6">
          <Link
            href="/login"
            className="px-8 py-3 bg-primary hover:bg-gray-900 hover:text-white transition rounded-full text-lg font-semibold shadow-lg text-primary-foreground"
          >
            Logar
          </Link>
          
        </div>
      </div>
    </main>
  );
}