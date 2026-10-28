export default function JsonLd({ data }: { data: Record<string, unknown> }) {
    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
                // "<" escape می‌شود تا متن واردشده‌ی ادمین نتواند تگ script را ببندد
                __html: JSON.stringify(data).replace(/</g, "\\u003c"),
            }}
        />
    )
}
