import { json } from "@tanstack/start/api"

export const GET = ({ request }: { request: Request }) => {
  return json({ users: [{ id: 1, name: "John Doe" }] })
}
