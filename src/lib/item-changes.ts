export const rarityToClass: Record<number, string> = {
  5: "bg-orange-500",
  2: "bg-pink-500",
  3: "bg-blue-500",
  4: "bg-purple-500",
  1: "bg-green-500",
};

export const textRarityToClass: Record<string, string> = {
  orange: "text-orange-500",
  pink: "text-pink-500",
  blue: "text-blue-500",
  purple: "text-purple-500",
  green: "text-green-500",
  white: "text-neutral-300",
};

export const rarityColors: Record<number, string> = {
  1: "bg-gray-500",
  2: "bg-green-500",
  3: "bg-blue-500",
  4: "bg-purple-500",
  5: "bg-orange-500",
};

type ItemTypeKey =
  | "Pistol"
  | "Shotgun"
  | "SMG"
  | "Assault Rifle"
  | "Sniper"
  | "Launcher"
  | "Grenade"
  | "Shield"
  | "Class Mod"
  | "Artifact";

export const typeIcons: Record<ItemTypeKey, string> = {
  Pistol: "🔫",
  Shotgun: "💥",
  SMG: "🔥",
  "Assault Rifle": "⚡",
  Sniper: "🎯",
  Launcher: "🚀",
  Grenade: "💣",
  Shield: "🛡️",
  "Class Mod": "⚙️",
  Artifact: "💎",
};

export const itemTypes = (type: string): ItemTypeKey => {
  const typeMap: Record<string, ItemTypeKey> = {
    GRND: "Grenade",
    SMG: "SMG",
    AR: "Assault Rifle",
    Com: "Class Mod",
    com: "Class Mod",
    SNPR: "Sniper",
    SHTGN: "Shotgun",
    ARTF: "Artifact",
    SHLD: "Shield",
    LNCHR: "Launcher",
    PSTL: "Pistol",
  };
  return typeMap[type];
};

export const itemRarity = (rarity: number) => {
  const rarityMap: Record<number, string> = {
    1: "Common",
    2: "Uncommon",
    3: "Rare",
    4: "Epic",
    5: "Legendary",
  };

  return rarityMap[rarity];
};
