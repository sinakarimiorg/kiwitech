"use client"

export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
    return (
        <html lang='fa' dir='rtl'>
            <body style={{ margin: 0, fontFamily: 'Tahoma, sans-serif', background: '#F7FAF0', color: '#3f3f46' }}>
                <main style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16, textAlign: 'center' }}>
                    <div style={{ maxWidth: 420 }}>
                        <h1 style={{ fontSize: 24, margin: '0 0 12px' }}>خطای غیرمنتظره</h1>
                        <p style={{ lineHeight: 2, color: '#71717a', margin: '0 0 24px' }}>
                            متأسفانه مشکلی در بارگذاری سایت پیش آمد. لطفاً دوباره تلاش کنید.
                        </p>
                        <button
                            type='button'
                            onClick={reset}
                            style={{ padding: '10px 24px', border: 0, borderRadius: 10, background: '#9FBE23', color: '#0F1115', fontSize: 16, cursor: 'pointer' }}
                        >
                            تلاش دوباره
                        </button>
                    </div>
                </main>
            </body>
        </html>
    )
}
