import "./globals.css"; // Ensure you have a globals.css or remove this line

export const metadata = {
  title: "Curaide | Health Monitoring",
  description: "Real-time SpO2 and Heart Rate Monitoring",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: 'sans-serif', backgroundColor: '#f4f7f6' }}>
        {children}
      </body>
    </html>
  );
}