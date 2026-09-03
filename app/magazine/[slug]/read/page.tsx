'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { API_BASE } from '@/lib/api'
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut, X, BookOpen } from 'lucide-react'

function useAntiDownload() {
  useEffect(() => {
    const block = (e: MouseEvent) => e.preventDefault()
    const blockKey = (e: KeyboardEvent) => {
      const ctrl = e.ctrlKey || e.metaKey
      if (
        (ctrl && ['s', 'p', 'u', 'a'].includes(e.key.toLowerCase())) ||
        e.key === 'F12' ||
        (ctrl && e.shiftKey && ['i', 'j', 'c'].includes(e.key.toLowerCase()))
      ) {
        e.preventDefault()
        e.stopPropagation()
      }
    }
    document.addEventListener('contextmenu', block)
    document.addEventListener('keydown', blockKey, true)
    return () => {
      document.removeEventListener('contextmenu', block)
      document.removeEventListener('keydown', blockKey, true)
    }
  }, [])
}

function paintWatermark(canvas: HTMLCanvasElement) {
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  ctx.save()
  ctx.globalAlpha = 0.07
  ctx.fillStyle = '#8B1E24'
  ctx.font = `bold ${Math.max(16, canvas.width * 0.03)}px sans-serif`
  ctx.textAlign = 'center'
  ctx.translate(canvas.width / 2, canvas.height / 2)
  ctx.rotate(-Math.PI / 6)
  const text = 'Dibrugarh Korean Club  •  INYEON'
  const step = canvas.height * 0.22
  for (let y = -canvas.height * 0.6; y < canvas.height * 0.6; y += step) {
    ctx.fillText(text, 0, y)
  }
  ctx.restore()
}

export default function MagazineReadPage() {
  useAntiDownload()

  const { slug } = useParams<{ slug: string }>()
  const router = useRouter()

  const [token, setToken] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [tokenLoading, setTokenLoading] = useState(true)

  const [pdf, setPdf] = useState<any>(null)
  const [pageNum, setPageNum] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const [scale, setScale] = useState(1.2)
  const [rendering, setRendering] = useState(false)

  const canvasRef = useRef<HTMLCanvasElement>(null)
  const renderTaskRef = useRef<any>(null)

  // 1. Fetch token
  useEffect(() => {
    fetch(`${API_BASE}/magazine/${slug}/pdf-token`)
      .then(r => {
        if (!r.ok) throw new Error('No PDF available for this issue.')
        return r.json()
      })
      .then(({ token }: { token: string }) => setToken(token))
      .catch(e => setError(e.message))
      .finally(() => setTokenLoading(false))
  }, [slug])

  // 2. Load PDF via pdfjs-dist npm package
  useEffect(() => {
    if (!token) return
    let cancelled = false

    async function load() {
      try {
        // Fetch the PDF bytes ourselves so pdfjs never makes an auth'd request
        const streamUrl = `${API_BASE}/magazine/pdf/stream?token=${token}`
        const res = await fetch(streamUrl)
        if (!res.ok) throw new Error(`Stream ${res.status}`)
        const buffer = await res.arrayBuffer()

        const pdfjs = await import('pdfjs-dist')
        pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs'

        const doc = await pdfjs.getDocument({ data: buffer }).promise
        if (!cancelled) {
          setPdf(doc)
          setTotalPages(doc.numPages)
        }
      } catch (e) {
        console.error('PDF load error:', e)
        if (!cancelled) setError('Failed to load PDF. The link may have expired — go back and try again.')
      }
    }

    load()
    return () => { cancelled = true }
  }, [token])

  // 3. Render page
  const renderPage = useCallback(async (doc: any, num: number, sc: number) => {
    if (!canvasRef.current) return
    setRendering(true)
    if (renderTaskRef.current) {
      try { renderTaskRef.current.cancel() } catch {}
      renderTaskRef.current = null
    }
    try {
      const page = await doc.getPage(num)
      const viewport = page.getViewport({ scale: sc })
      const canvas = canvasRef.current
      canvas.height = viewport.height
      canvas.width = viewport.width
      const ctx = canvas.getContext('2d')!
      const task = page.render({ canvasContext: ctx, viewport })
      renderTaskRef.current = task
      await task.promise
      paintWatermark(canvas)
    } catch (e: any) {
      if (e?.name !== 'RenderingCancelledException') {
        console.error(e)
      }
    } finally {
      setRendering(false)
    }
  }, [])

  useEffect(() => {
    if (pdf) renderPage(pdf, pageNum, scale)
  }, [pdf, pageNum, scale]) // eslint-disable-line

  const prev   = () => setPageNum(n => Math.max(1, n - 1))
  const next   = () => setPageNum(n => Math.min(totalPages, n + 1))
  const zoomIn  = () => setScale(s => Math.min(3, +(s + 0.2).toFixed(1)))
  const zoomOut = () => setScale(s => Math.max(0.5, +(s - 0.2).toFixed(1)))

  if (tokenLoading) return (
    <div className="fixed inset-0 flex items-center justify-center" style={{ background: '#0E0604' }}>
      <p className="font-sans text-sm" style={{ color: '#9CA3AF' }}>Preparing secure viewer…</p>
    </div>
  )

  if (error) return (
    <div className="fixed inset-0 flex flex-col items-center justify-center gap-4" style={{ background: '#0E0604' }}>
      <BookOpen size={36} style={{ color: '#8B1E24' }} />
      <p className="font-sans text-center px-6" style={{ color: '#F5CECA', maxWidth: 400 }}>{error}</p>
      <button
        onClick={() => router.back()}
        className="px-5 py-2 rounded-xl font-sans text-sm font-semibold"
        style={{ background: '#8B1E24', color: '#fff' }}
      >
        Go back
      </button>
    </div>
  )

  return (
    <div
      className="fixed inset-0 flex flex-col overflow-hidden select-none"
      style={{ background: '#0E0604', userSelect: 'none', WebkitUserSelect: 'none' }}
      onContextMenu={e => e.preventDefault()}
    >
      {/* Top bar */}
      <div
        className="flex items-center justify-between px-4 py-2 flex-shrink-0"
        style={{ background: '#1A0A05', borderBottom: '1px solid #3A2010' }}
      >
        <button
          onClick={() => router.back()}
          className="flex items-center gap-1.5 font-sans text-sm font-medium transition-opacity hover:opacity-70"
          style={{ color: '#C9A882' }}
        >
          <X size={16} /> Close
        </button>

        <p className="font-sans text-xs font-semibold uppercase tracking-widest" style={{ color: '#8B1E24' }}>
          Inyeon · Original Handmade Edition
        </p>

        <div className="flex items-center gap-2">
          <button onClick={zoomOut} className="p-1.5 rounded-lg hover:opacity-70 transition-opacity" style={{ color: '#C9A882' }}>
            <ZoomOut size={16} />
          </button>
          <span className="font-sans text-xs tabular-nums" style={{ color: '#C9A882', minWidth: 36, textAlign: 'center' }}>
            {Math.round(scale * 100)}%
          </span>
          <button onClick={zoomIn} className="p-1.5 rounded-lg hover:opacity-70 transition-opacity" style={{ color: '#C9A882' }}>
            <ZoomIn size={16} />
          </button>
        </div>
      </div>

      {/* Canvas area */}
      <div className="flex-1 overflow-auto flex justify-center py-6 px-4">
        {!pdf && (
          <div className="flex items-center justify-center w-full">
            <p className="font-sans text-sm" style={{ color: '#6B5C4A' }}>Loading PDF…</p>
          </div>
        )}
        <canvas
          ref={canvasRef}
          style={{
            display: pdf ? 'block' : 'none',
            maxWidth: '100%',
            height: 'auto',
            boxShadow: '0 8px 40px rgba(0,0,0,0.6)',
            borderRadius: 4,
            pointerEvents: 'none',
          }}
        />
      </div>

      {/* Bottom nav */}
      <div
        className="flex items-center justify-center gap-4 px-4 py-3 flex-shrink-0"
        style={{ background: '#1A0A05', borderTop: '1px solid #3A2010' }}
      >
        <button
          onClick={prev}
          disabled={pageNum === 1 || !pdf}
          className="p-2 rounded-xl disabled:opacity-30 hover:opacity-70 transition-opacity"
          style={{ color: '#C9A882' }}
        >
          <ChevronLeft size={20} />
        </button>

        <span className="font-sans text-sm tabular-nums" style={{ color: '#C9A882' }}>
          {pdf ? (rendering ? '…' : pageNum) : '—'} / {totalPages || '—'}
        </span>

        <button
          onClick={next}
          disabled={pageNum === totalPages || !pdf}
          className="p-2 rounded-xl disabled:opacity-30 hover:opacity-70 transition-opacity"
          style={{ color: '#C9A882' }}
        >
          <ChevronRight size={20} />
        </button>
      </div>
    </div>
  )
}
