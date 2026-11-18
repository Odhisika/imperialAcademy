/**
 * Renders schema.org JSON-LD. Accepts one object or an array of objects.
 * The `<` escape prevents a `</script>` sequence inside content from
 * breaking out of the script tag.
 */
export default function JsonLd({
  data,
}: {
  data: Record<string, unknown> | Record<string, unknown>[]
}) {
  const json = JSON.stringify(data).replace(/</g, '\\u003c')

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: json }}
    />
  )
}
