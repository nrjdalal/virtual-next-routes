import { json } from "@tanstack/start/api"

export const GET = ({
  request,
  params,
}: {
  request: Request
  params: { slug: string }
}) => {
  return json({ slug: params.slug, content: "Dynamic content" })
}
