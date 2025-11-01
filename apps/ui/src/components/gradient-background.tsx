export function GradientBackground(props: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div
      className={`relative overflow-hidden h-[100vh] w-full ${props.className}`}
    >
      <div className="flex flex-col items-center absolute right-0 left-0 -top-10 blur-[5vh] z-0 animate-[spin_30s_linear_infinite] pointer-events-none select-none will-change-transform">
        {/* <div className="flex flex-col items-end absolute -right-60 -top-10 blur-xl z-0 animate-[spin_30s_linear_infinite] pointer-events-none select-none"> */}
        <div className="h-[30vh] rounded-full w-[60%] z-1 bg-gradient-to-b blur-[15vh] animate-[bounce_4.5s_linear_infinite] from-pink-900 to-primary will-change-transform"></div>
        <div className="h-[30vh] rounded-full w-[90%] z-1 bg-gradient-to-b blur-[15vh] animate-[bounce_6s_linear_infinite] from-primary to-sky-500 will-change-transform"></div>
        <div className="h-[30vh] rounded-full w-[100%] z-1 bg-gradient-to-b blur-[15vh] animate-[bounce_5s_linear_infinite] from-purple-300 to-sky-600 will-change-transform"></div>
        <div className="h-[30vh] rounded-full w-[70%] z-1 bg-gradient-to-b blur-[15vh] animate-[bounce_4.5s_linear_infinite] from-pink-900 to-primary will-change-transform"></div>
        <div className="absolute h-[100%] rounded-full w-[100%] z-1 bg-gradient-to-b blur-[20rem] animate-[spin_10s_linear_infinite] from-pink-900 to-primary opacity-20 will-change-transform"></div>
      </div>
      <div className="absolute inset-0 z-0 bg-noise opacity-30 pointer-events-none"></div>

      {props.children}
    </div>
  )
}
