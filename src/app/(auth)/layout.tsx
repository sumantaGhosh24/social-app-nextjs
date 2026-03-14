export default async function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-screen w-full items-center justify-center">
      <div className="min-w-[60%] space-y-4 rounded-md p-5 shadow-md dark:shadow-gray-400">
        <>{children}</>
      </div>
    </div>
  );
}
