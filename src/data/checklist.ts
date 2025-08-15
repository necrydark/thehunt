import db from "@/lib/db"

export const getAllItems = async () => {
  const res = await db.item.findMany()
  return res
}