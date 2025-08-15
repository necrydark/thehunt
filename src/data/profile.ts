import db from "@/lib/db";

export async function getAllUserItems(name: string) {
  const res = await db.user.findUnique({
    where: {
      name
    },
    include: {
      userItems: {
        include: {
          item: true,
        },
        orderBy: {
          obtainedAt: "asc"
        }
      },
      submissions: true
    }
  })

  return res;
}