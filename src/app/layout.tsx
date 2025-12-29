iimport type { ReactNode } from "react";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}

        <footer style={{ marginTop: "4rem", padding: "2rem", fontSize: "0.85rem", color: "#555" }}>
          <p>
            Earth Carbon Registry tracks low-carbon actions and carbon-credit
            preparedness. Credit issuance is subject to registry methodologies,
            MRV requirements, and host-country authorization.
          </p>
          <p>
            ESG actions do not automatically qualify as carbon credits.
          </p>
        </footer>
      </body>
    </html>
  );
}
