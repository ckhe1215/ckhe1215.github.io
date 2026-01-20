import { ImageResponse } from "next/og";

// Image metadata
export const alt = "Haeun Kim's Blog";
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

// Image generation
export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 128,
          background: "linear-gradient(to bottom right, #1e293b, #0f172a)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            fontSize: 80,
            fontWeight: "bold",
            marginBottom: 20,
          }}
        >
          Haeun Kim
        </div>
        <div
          style={{
            fontSize: 40,
            color: "#94a3b8",
          }}
        >
          Frontend Developer Blog
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
