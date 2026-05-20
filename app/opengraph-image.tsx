import { ImageResponse } from 'next/og';
import { SITE } from '@/lib/site';
import { LOCKED_H1 } from '@/lib/copy';

export const runtime = 'edge';
export const alt = SITE.name;
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function OpengraphImage() {
  try {
    return new ImageResponse(
      (
        <div
          style={{
            background: '#0a0e1f',
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            padding: 64,
            color: '#f8fafc',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div
              style={{
                width: 48,
                height: 48,
                background: '#3b82f6',
                color: '#0a0e1f',
                borderRadius: 8,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 28,
                fontWeight: 700,
              }}
            >
              D
            </div>
            <div style={{ fontSize: 28, fontWeight: 600 }}>
              DeskPilot <span style={{ color: '#94a3b8', fontWeight: 400 }}>Academy</span>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            <div style={{ fontSize: 64, fontWeight: 700, lineHeight: 1.05, letterSpacing: -1.5 }}>
              {LOCKED_H1}
            </div>
            <div style={{ fontSize: 26, color: '#94a3b8', maxWidth: 980, lineHeight: 1.3 }}>
              Not theory — the actual desk process. Built by working dealership operators.
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderTop: '1px solid #1e293b',
              paddingTop: 24,
              fontSize: 20,
              color: '#94a3b8',
            }}
          >
            <div>{SITE.domain}</div>
            <div style={{ color: '#ef5536', fontWeight: 600 }}>Founders pricing — limited</div>
          </div>
        </div>
      ),
      { ...size },
    );
  } catch (err) {
    console.error('[og] image generation failed', err);
    return Response.redirect(`${SITE.url}/og-fallback.png`, 302);
  }
}
