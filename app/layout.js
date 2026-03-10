export const metadata = {
  title: "Curaide Monitoring Dashboard",
  description: "Real-time SpO2 and Heart Rate Monitoring System",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          padding: 0,
          fontFamily: "system-ui, -apple-system, sans-serif",
          backgroundColor: "#f8fafc",
          minHeight: "100vh",
        }}
      >
        {children}
      </body>
    </html>
  );
}