import { ImageResponse } from "next/og";

export const runtime = "edge";

export async function GET() {
  const playfairData = fetch(
    new URL(
      "https://fonts.gstatic.com/s/playfairdisplay/v37/nuFvD-vYSZviVYUb_rj3ij__anPXJzDwcbmjWBN2PKdFvXDXbtY.ttf"
    )
  ).then((res) => res.arrayBuffer());

  const dmSansData = fetch(
    new URL(
      "https://fonts.gstatic.com/s/dmsans/v15/rP2Hp2ywxg089UriCZOIHQ.ttf"
    )
  ).then((res) => res.arrayBuffer());

  const [playfair, dmSans] = await Promise.all([playfairData, dmSansData]);

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
        }}
      >
        {/* Gold gradient top bar */}
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

        {/* Location badge */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            marginBottom: "36px",
          }}
        >
          <div
            style={{
              width: "10px",
              height: "10px",
              borderRadius: "50%",
              backgroundColor: "#C8952A",
              display: "flex",
            }}
          />
          <span
            style={{
              fontFamily: "DM Sans",
              fontSize: "18px",
              color: "#C8952A",
              letterSpacing: "3px",
            }}
          >
            OKINAWA, JAPAN
          </span>
        </div>

        {/* Title */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            marginBottom: "28px",
          }}
        >
          <span
            style={{
              fontFamily: "Playfair Display",
              fontSize: "74px",
              fontWeight: 700,
              color: "#EDE5D0",
              lineHeight: "1.1",
            }}
          >
            The Art of
          </span>
          <span
            style={{
              fontFamily: "Playfair Display",
              fontSize: "74px",
              fontWeight: 700,
              color: "#C8952A",
              lineHeight: "1.1",
              fontStyle: "italic",
            }}
          >
            Braiding
          </span>
        </div>

        {/* Gold line */}
        <div
          style={{
            width: "80px",
            height: "3px",
            backgroundColor: "#C8952A",
            marginBottom: "28px",
            display: "flex",
          }}
        />

        {/* Tagline */}
        <div
          style={{
            display: "flex",
            maxWidth: "520px",
          }}
        >
          <span
            style={{
              fontFamily: "DM Sans",
              fontSize: "24px",
              color: "#8899AA",
              lineHeight: "1.5",
            }}
          >
            Handcrafted braids. Natural care. A sanctuary for your beauty in Okinawa.
          </span>
        </div>

        {/* Bottom bar */}
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
              fontFamily: "Playfair Display",
              fontSize: "28px",
              fontWeight: 700,
              color: "#EDE5D0",
              letterSpacing: "6px",
            }}
          >
            LEY BEAUTY
          </span>
          <span
            style={{
              fontFamily: "DM Sans",
              fontSize: "16px",
              color: "#4A5568",
            }}
          >
            leybeauty.vercel.app
          </span>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
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
