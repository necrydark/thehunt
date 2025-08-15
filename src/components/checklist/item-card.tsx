import { Item } from "@prisma/client";

type Props = {
  item: Item;
};

export default function ItemCard({ item }: Props) {
  return <div>ItemCard</div>;
}
