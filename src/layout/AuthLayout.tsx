type Props = { children: React.ReactNode };

export default function AuthLayout({ children }: Props) {
  return (
    <div className="relative min-h-screen w-screen overflow-hidden">

      <div className="absolute inset-0 bg-gradient-to-b from-[#0B0B0B] via-[#1B0B2F] to-[#4B1A88]" />

      <div className="absolute inset-0 pointer-events-none
                      [background:radial-gradient(60%_50%_at_50%_40%,rgba(255,255,255,0.08),transparent_60%)]" />

      <div className="relative min-h-screen w-full grid place-items-center px-4">
        {children}
      </div>
    </div>
  );
}
