import { ImageResponse } from 'next/og'
import { readFileSync } from 'fs'
import { join } from 'path'

export const runtime = 'nodejs'
export const alt = 'Dibrugarh Korean Club'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OgImage() {
  const logoBuffer = readFileSync(join(process.cwd(), 'public', 'logo.png'))
  const logoSrc = `data:image/png;base64,${logoBuffer.toString('base64')}`

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #1A0A05 0%, #2D0F0A 50%, #1A0A05 100%)',
          position: 'relative',
          fontFamily: 'serif',
        }}
      >
        {/* Top accent bar */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 6,
            background: 'linear-gradient(90deg, #8B1E24, #C4783A)',
          }}
        />

        {/* Korean watermark */}
        <div
          style={{
            position: 'absolute',
            right: 50,
            top: 30,
            fontSize: 220,
            color: 'rgba(255,255,255,0.04)',
            lineHeight: 1,
          }}
        >
          한국
        </div>

        {/* Logo */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={logoSrc}
          width={110}
          height={110}
          alt=""
          style={{ borderRadius: 16, marginBottom: 28, objectFit: 'contain' }}
        />

        {/* Club name */}
        <div
          style={{
            fontSize: 52,
            fontWeight: 700,
            color: '#FFFFFF',
            letterSpacing: '-0.5px',
            textAlign: 'center',
            lineHeight: 1.15,
          }}
        >
          Dibrugarh Korean Club
        </div>

        {/* Korean subtitle */}
        <div
          style={{
            fontSize: 22,
            color: 'rgba(255,255,255,0.45)',
            marginTop: 10,
            letterSpacing: 4,
          }}
        >
          디브루가르 한국 클럽
        </div>

        {/* Tagline */}
        <div
          style={{
            marginTop: 24,
            fontSize: 20,
            color: 'rgba(196,168,130,0.9)',
            textAlign: 'center',
            maxWidth: 700,
          }}
        >
          Korean Language &amp; Culture · Dibrugarh University · Assam, India
        </div>

        {/* Bottom accent bar */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: 4,
            background: 'linear-gradient(90deg, #C4783A, #8B1E24)',
          }}
        />
      </div>
    ),
    { ...size }
  )
}
