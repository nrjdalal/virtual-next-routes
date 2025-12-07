import { json } from "@tanstack/start/api"

export const GET = ({ request }: { request: Request }) => {
  return json({ message: "Hello from API!" })
}
