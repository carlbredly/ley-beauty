import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = "LEY Beauty — Luxury Braiding Salon in Okinawa";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function TwitterImage() {
  const playfair = await fetch(
    new URL(
      "https://fonts.gstatic.com/s/playfairdisplay/v37/nuFvD-vYSZviVYUb_rj3ij__anPXJzDwcbmjWBN2PKdFvXDXbtY.ttf"
    )
  ).then((res) => res.arrayBuffer());

  const dmSans = await fetch(
    new URL(
      "https://fonts.gstatic.com/s/dmsans/v15/rP2Hp2ywxg089UriCZOIHQ.ttf"
    )
  ).then((res) => res.arrayBuffer());

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "60px 80px",
          backgroundColor: "#080B0F",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Subtle gold radial glow */}
        <div
          style={{
            position: "absolute",
            top: "-120px",
            right: "-80px",
            width: "600px",
            height: "600px",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(200,149,42,0.12) 0%, transparent 70%)",
            display: "flex",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "-100px",
            left: "-60px",
            width: "400px",
            height: "400px",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(196,89,58,0.08) 0%, transparent 70%)",
            display: "flex",
          }}
        />

        {/* Top bar: location badge */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            marginBottom: "32px",
          }}
        >
          <div
            style={{
              width: "8px",
              height: "8px",
              borderRadius: "50%",
              backgroundColor: "#C8952A",
              display: "flex",
            }}
          />
          <span
            style={{
              fontFamily: '"DM Sans"',
              fontSize: "18px",
              color: "#C8952A",
              letterSpacing: "2px",
              textTransform: "uppercase",
            }}
          >
            Okinawa, Japan
          </span>
        </div>

        {/* Main title */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "4px",
            marginBottom: "24px",
          }}
        >
          <span
            style={{
              fontFamily: '"Playfair Display"',
              fontSize: "72px",
              fontWeight: 700,
              color: "#EDE5D0",
              lineHeight: 1.1,
            }}
          >
            The Art of
          </span>
          <span
            style={{
              fontFamily: '"Playfair Display"',
              fontSize: "72px",
              fontWeight: 700,
              fontStyle: "italic",
              color: "#C8952A",
              lineHeight: 1.1,
            }}
          >
            Braiding
          </span>
        </div>

        {/* Gold divider */}
        <div
          style={{
            width: "80px",
            height: "3px",
            backgroundColor: "#C8952A",
            marginBottom: "24px",
            borderRadius: "2px",
            display: "flex",
          }}
        />

        {/* Tagline */}
        <span
          style={{
            fontFamily: '"DM Sans"',
            fontSize: "22px",
            color: "#8899AA",
            maxWidth: "500px",
            lineHeight: 1.5,
          }}
        >
          Handcrafted braids. Natural care. A sanctuary for your beauty in
          Okinawa.
        </span>

        {/* Bottom: brand name */}
        <div
          style={{
            position: "absolute",
            bottom: "50px",
            left: "80px",
            right: "80px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span
            style={{
              fontFamily: '"Playfair Display"',
              fontSize: "28px",
              fontWeight: 600,
              color: "#EDE5D0",
              letterSpacing: "4px",
            }}
          >
            LEY BEAUTY
          </span>
          <span
            style={{
              fontFamily: '"DM Sans"',
              fontSize: "16px",
              color: "#3D4450",
            }}
          >
            leybeauty.vercel.app
          </span>
        </div>

        {/* Border accent */}
        <div
          style={{
            position: "absolute",
            top: "0",
            left: "0",
            right: "0",
            height: "4px",
            background: "linear-gradient(90deg, #C8952A, #E0A830, #C4593A)",
            display: "flex",
          }}
        />
      </div>
    ),
    {
      ...size,
      fonts: [
        {
          name: "Playfair Display",
          data: playfair,
          style: "normal",
          weight: 700,
        },
        {
          name: "DM Sans",
          data: dmSans,
          style: "normal",
          weight: 400,
        },
      ],
    }
  );
}
