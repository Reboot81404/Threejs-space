import ThreeScene from "./components/ThreeScene"

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
      <ThreeScene />
      {children}</body>
    </html>
  )
}
