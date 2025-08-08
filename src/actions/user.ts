import db from "@/lib/db";


export async function getUser(name: string) {
  if(!name) return;
  const res = await db.user.findUnique({
    where: {
      name
    }
  })

  return res
}