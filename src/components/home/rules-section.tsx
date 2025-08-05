"use client"

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { cn } from "@/lib/utils"
import { CheckCircle, Lightbulb, MessageSquare, ReceiptText, User, XCircle } from "lucide-react"
import type { JSX } from "react/jsx-runtime"

interface RichTextSegment {
  text: string
  href?: string // If it's a link
  className?: string // For bold, italic, strikethrough
}

interface RuleContentItem {
  segments: RichTextSegment[] // Use segments for rich text
  icon?: "check" | "x" | "tip"
  subItems?: RuleContentItem[]
  className?: string // For styling the overall list item
}

interface RuleContentBlock {
  type: "paragraph" | "heading" | "list"
  segments?: RichTextSegment[] // For paragraph, heading
  items?: RuleContentItem[] // For list
  level?: 2 | 3 | 4 // For heading (h2, h3, h4)
  className?: string // For custom styling on blocks
  icon?: "receipt" | "speech-bubble" | "user" // New: icon for headings
}

interface Rule {
  id: string
  title: string
  contentBlocks: RuleContentBlock[]
}

function RichText({ segments }: { segments?: RichTextSegment[] }) {
  return (
    <>
      {(segments || []).map((segment, idx) => {
        if (segment.href) {
          return (
            <a
              key={idx}
              href={segment.href}
              target="_blank"
              rel="noopener noreferrer"
              className={cn("text-[#BBFE17] hover:underline", segment.className)}
            >
              {segment.text}
            </a>
          )
        }
        return (
          <span key={idx} className={cn(segment.className)}>
            {segment.text}
          </span>
        )
      })}
    </>
  )
}

function RenderListItem({ item }: { item: RuleContentItem }) {
  const IconComponent =
    item.icon === "check" ? CheckCircle : item.icon === "x" ? XCircle : item.icon === "tip" ? Lightbulb : null
  const iconColorClass =
    item.icon === "check"
      ? "text-green-400"
      : item.icon === "x"
        ? "text-red-400"
        : item.icon === "tip"
          ? "text-yellow-400"
          : ""

  return (
    <li className="flex items-start gap-2">
      {IconComponent ? (
        <IconComponent className={cn("mt-1 flex-shrink-0", iconColorClass)} size={16} />
      ) : (
        <span className="mt-1 flex-shrink-0 text-white">&#x2022;</span>
      )}
      <div className="flex-grow">
        <span className={cn("block", item.className)}>
          <RichText segments={item.segments} />
        </span>
        {item.subItems && item.subItems.length > 0 && (
          <ul className="list-none ml-6 mt-1 space-y-1">
            {item.subItems.map((subItem, subIdx) => (
              <RenderListItem key={subIdx} item={subItem} />
            ))}
          </ul>
        )}
      </div>
    </li>
  )
}

function RenderContentBlocks({ blocks }: { blocks: RuleContentBlock[] }) {
  return (
    <div className="space-y-4">
      {blocks.map((block, index) => {
        if (block.type === "paragraph") {
          return (
            <p key={index} className={cn("text-white", block.className)}>
              {block.segments && <RichText segments={block.segments} />}
            </p>
          )
        } else if (block.type === "heading") {
          const HeadingTag = `h${block.level || 3}` as keyof JSX.IntrinsicElements
          const HeadingIcon =
            block.icon === "receipt" ? ReceiptText : block.icon === "speech-bubble" ? MessageSquare : block.icon === "user" ? User : null
          return (
            <HeadingTag key={index} className={cn("font-bold text-white flex items-center gap-2", block.className)}>
              {HeadingIcon && <HeadingIcon size={20} className="text-white" />}
              {block.segments && <RichText segments={block.segments} />}
            </HeadingTag>
          )
        } else if (block.type === "list") {
          return (
            <ul key={index} className={cn("list-none space-y-1 text-white", block.className)}>
              {block.items?.map((item, itemIdx) => (
                <RenderListItem key={itemIdx} item={item} />
              ))}
            </ul>
          )
        }
        return null
      })}
    </div>
  )
}

export default function RulesSection() {
  const rulesData: Rule[] = [
    {
      id: "registration-requirements",
      title: "Registration Requirements",
      contentBlocks: [
        {
          type: "list",
          items: [
            {
              segments: [{ text: "To be a valid participant and be eligible for the leaderboard, you must:" }],
              subItems: [
                {
                  segments: [
                    { text: "Register on the " },
                    { text: "official website", href: "https://example.com/official-website" },
                    { text: "." },
                  ],
                },
                { segments: [{ text: "Select your Vault Hunter and platform when registering." }] },
                {
                  segments: [
                    { text: "Join the Borderlands Community Team on " },
                    { text: "Tiltify", href: "https://tiltify.com" },
                    { text: "." },
                  ],
                },
                {
                  segments: [
                    {
                      text: "Create a campaign supporting the team on Tiltify (campaign URL will be provided).",
                    },
                  ],
                },
                {
                  segments: [
                    {
                      text: "Include a donate command in the title of your Twitch stream to promote the charity.",
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
    {
      id: "co-op-item-rules",
      title: "Co-op and Item Use Rules",
      contentBlocks: [
        {
          type: "list",
          items: [
            {
              segments: [{ text: "Co-op play is allowed and encouraged!" }],
              subItems: [
                { segments: [{ text: "All co-op players must:" }] },
                { segments: [{ text: "Be registered on the Hunt site." }] },
                { segments: [{ text: "Have a Tiltify campaign linked." }] },
                { segments: [{ text: "Stream their own gameplay." }] },
              ],
            },
            {
              segments: [
                {
                  text: "If a co-op partner does not follow all rules of the event, both participants will be disqualified from leaderboards.",
                },
              ],
            },
            {
              segments: [{ text: "Non-participants may not assist", className: "font-bold" }, { text: " in any way." }],
              subItems: [
                {
                  segments: [
                    { text: "Joining a game late for loot or progression is " },
                    { text: "not allowed", className: "font-bold line-through" },
                    { text: " (e.g., entering just before a boss kill)." },
                  ],
                },
                { segments: [{ text: "All players in a party must be within +3 levels of the host." }] },
                { segments: [{ text: "XP or quest progression boosting is prohibited." }] },
                {
                  segments: [
                    {
                      text: "If a drop is found in co-op, only one clip/highlight is required. Include all teammates' names in the clip title.",
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          type: "heading",
          level: 4,
          segments: [{ text: "Allowed Exceptions for Game Bugs" }],
          className: "text-white mt-6",
        },
        {
          type: "list",
          items: [
            {
              segments: [
                {
                  text: "If a soft or hard lock prevents game progression, you may join another participating player to complete the mission regardless of level difference.",
                },
              ],
            },
          ],
        },
        { type: "heading", level: 4, segments: [{ text: "Item Use Rules" }], className: "text-white mt-6" },
        { type: "heading", level: 4, segments: [{ text: "You may NOT use:", className: "text-red-400" }] },
        {
          type: "list",
          items: [
            { icon: "x", segments: [{ text: "Items from Golden Chest, Diamond Loot Room, or Vault Cards/Chests." }] },
            { icon: "x", segments: [{ text: "Vault Card XP is allowed as there's no way to disable it." }] },
            { icon: "x", segments: [{ text: "Gear from your bank that was not found during the Hunt." }] },
            { icon: "x", segments: [{ text: "Items from Deluxe editions or pre-order bonuses." }] },
            { icon: "x", segments: [{ text: "Mailed items from other players." }] },
            { icon: "x", segments: [{ text: "Gear passed from other characters." }] },
          ],
        },
        { type: "heading", level: 4, segments: [{ text: "You may use:", className: "text-green-400 mt-6" }] },
        {
          type: "list",
          items: [
            {
              icon: "check",
              segments: [
                { text: "Bank and Lost Loot machine items " },
                { text: "earned during this Hunt", className: "font-bold" },
                { text: "." },
              ],
            },
            {
              icon: "check",
              segments: [
                { text: "Mailed gear from " },
                { text: "NPCs or manufacturers", className: "font-bold" },
                { text: " (e.g., after weapon or crew challenges)." },
              ],
            },
            {
              icon: "check",
              segments: [
                { text: "Mailed items like the Baby Maker or Lyuda if " },
                { text: "earned through in-game challenges", className: "font-bold" },
                { text: " (may also be claimed for points)." },
              ],
            },
            {
              icon: "tip",
              segments: [
                {
                  text: "Empty your bank and Lost Loot machine before starting your Hunt character to avoid disqualification.",
                },
              ],
              className: "text-yellow-400",
            },
          ],
        },
      ],
    },
    {
      id: "winning-criteria",
      title: "Winning Criteria",
      contentBlocks: [
        {
          type: "list",
          items: [
            {
              segments: [
                {
                  text: "Winners are determined by the shortest total ",
                },
                { text: "STREAM", className: "italic" },
                { text: " time to complete the item checklist." },
              ],
            },
            { segments: [{ text: "Leaderboards will recognize top performers for each Vault Hunter and platform." }] },
            {
              segments: [{ text: "Times are validated using Twitch VODs (Past Broadcasts or Highlights)." }],
              subItems: [
                {
                  segments: [
                    {
                      text: "You must display character time at the beginning and end of your play session captured within your stream VOD/Highlight.",
                    },
                  ],
                },
                {
                  segments: [
                    {
                      text: "Although the character time is inaccurate and can't be used to determine the actual time, it is useful to review while validating final completion times for the following reasons:",
                    },
                  ],
                  subItems: [
                    {
                      segments: [
                        {
                          text: "Displaying total character time helps identify beginning and end of each session while validating total time.",
                        },
                      ],
                    },
                    { segments: [{ text: "Proves a VOD has not been deleted." }] },
                    { segments: [{ text: "Identifies order of Highlights created." }] },
                    { segments: [{ text: "Deters offline progression/farming." }] },
                  ],
                },
              ],
            },
            {
              segments: [
                { text: "Missing VODs will incur up to a total of 24 hours time penalty for each missing stream day." },
              ],
            },
          ],
        },
      ],
    },
    {
      id: "gameplay-rules",
      title: "Gameplay Rules",
      contentBlocks: [
        {
          type: "list",
          items: [
            {
              segments: [
                {
                  text: "Play must occur on the ",
                },
                {
                  text: "latest version ",
                  className: "font-bold"
                },
                {
                  text: "of Borderlands 3 with all current hotfixes applied.",
                },
              ],
            },
            {
              segments: [
                { text: "Mods, cheats, trainers, or save editing", className: "font-bold" },
                { text: "will result in immediate disqualification from the leaderboard."}
              ],
              subItems: [
                {
                  segments: [
                    {
                      text: "This includes any third-party tools used to affect the game. For example, anything that modifies the frame rate or time of day to gain additional skill points or access to different Black Market items.",
                    },
                  ],
                },          
              ],
            },
            {
              segments: [
                { text: "Sanctuary science machine boosters are " },
                { text: "not", className: "font-bold italic"},
                { text: " allowed."}
              ],
            },
            {
              segments: [
                { text: "Out of Bounds (OOB) is allowed during the event." },
              ],
            },
            {
              segments: [
                { text: "You may adjust the level of Mayhem Mode or deactivate it at any time." },
              ],
            },
            {
              segments: [
                { text: "Special events (e.g. Bloody Harvest, Broken Hearts) can be toggled at the character select screen at any time." },
              ],
            },
          ],
        },
     
      ],
    },
    {
      id: "streaming-requirements",
      title: "Streaming Requirements",
      contentBlocks: [
        {
          type: "list",
          items: [
            {
              segments: [
                {
                  text: "All gameplay ",
                },
                { text: "must be streaming on Twitch", className: "font-bold" },
                { text: " with" },
                { text: " VODs enabled.", className: "font-bold" },
              ],
            },
            {
              segments: [{ text: "Enable VODs in Twitch: Settings → Stream → VOD Settings → Store past broadcasts." }],
              subItems: [
                {
                  segments: [
                    {
                      text: "VODs must show the full gameplay session and remain available for review.",
                    },
                  ],
                },
                {
                  segments: [
                    { text: "If you can't keep VODs longer than 7 days, create .",},
                    { text: "Twitch Highlights", className: "font-bold" },
                    { text: " instead."},
                  ],
                },
                {
                  segments: [
                    {
                      text: "Contact an admin if you run into the Twitch 100-hour highlight limit.",
                    },
                  ],
                },
                {
                  segments: [
                    {
                      text: "Vault Hunters who do not have Highlights and/or Past Broadcasts available to show the entire playthrough of their Hunt may be disqualified from the leaderboards.",
                    },
                  ],
                },
              ],
            },
            {
              segments: [
                { text: "If playing on console, show the game dashboard at the start of each session." },
              ],
            },
            {
              icon: "tip",
              segments: [
                {
                  text: "You can enable VODs in your Creator Dashboard under Settings -> Stream -> VOD Settings -> Store past broadcasts. Some streamers may not be able to store VODs for longer than 7 days",
                },
              ],
              className: "text-yellow-400",
            },
          ],
        },
        {
          type: "heading",
          level: 4,
          segments: [{ text: "Notes:" }],
          className: "text-white mt-6 italic",
        },
        {
          type: "list",
          items: [
            {
              segments: [
                {
                  text: "If unable to store VODs for 14 days or longer, create a Highlight of the videos which can be saved indefinitely.",
                },
              ],
            },
            {
              segments: [
                {
                  text: "If the 100 hour highlight limit is a concern, reach out to admin staff to ensure your VODs are captured and you don’t incur a 24 hour penalty per lost session.",
                },
              ],
            },
          ],
        },
      ],
    },
    {
      id: "timer-guidelines-and-character-creation",
      title: "Timer Guidelines and Character Creation",
      contentBlocks: [
        {
          type: "list",
          items: [
            {
              segments: [
                { text: "Your run time" },
                {text: " starts", className: "font-bold"},
                { text: " when you press “Play” from the start screen." },
              ],
            },
            {
              segments: [
                { text: "Your run time" },
                {text: " ends", className: "font-bold"},
                { text: " at the final save/quit of each stream session." },
              ],
            },
            {
              segments: [
                { text: "Your completion time" },
                {text: " ends", className: "font-bold"},
                { text: " with your final save and quit after finding the last item." },
              ],
            },
            {
              segments: [
                {
                  text: "Timer overlays are not required for competing on the leaderboard, but are encouraged where possible.",
                },
              ],
            },
            {
              segments: [
                {
                  text: "There is no daily streaming limit, but please remember to take breaks, stay hydrated, and focus on self care rather than being the first to finish.",
                },
              ],
            },
          ],
        },
        { type: "heading", level: 3, segments: [{ text: "Character Setup" }], icon: "user", className: "mt-6" },
        {
          type: "list",
          items: [
            {
              segments: [
                { text: "Start with a " },
                { text: "brand new level 1 character.", className: "font-bold" },
              ],
            },
            {
              segments: [
                { text: "You may restart, but " },
                { text: "must reset all progress", className: "font-bold" },
                { text: " by revoking item claims (no items may carry over)." },

              ],
            },
            {
              segments: [
                { text: "Use " },
                { text: "NORMAL difficulty. ", className: "font-bold" },
                { text: "Do not select Easy." },
              ],
            },
            {
              segments: [
                { text: "Guardian Rank must be disabled." },
              ],
            },
            {
              segments: [
                { text: "True Vault Hunter Mode is optional." },
              ],
            },
            {
              icon: "tip",
              segments: [
                {
                  text: "Remember to use Cooperation mode to ensure you have access to the Lost Loot machine.",
                },
              ],
              className: "text-yellow-400",
            },
          ],
          
        },
     
      ],
    },
    {
      id: "scoring-drop-validity",
      title: "Scoring and Drop Validity",
      contentBlocks: [
        {
          type: "list",
          items: [
            {
              segments: [
                { text: "World drops do not count", className: "font-bold" },
                { text: " for checklist points." },
              ],
            },
            {
              segments: [
                { text: "A world drop is a legendary that drops from a source " },
                { text: "other than its dedicated source", className: "font-bold" },
                { text: "." },
              ],
            },
            {
              segments: [
                {
                  text: "The Arms Race exclusives can be claimed for points no matter where they drop within Stormblind Complex.",
                },
              ],
            },
            {
              segments: [
                {
                  text: "You can count all Handsome Jackpot Class Mods for points no matter they drop within that DLC.",
                },
              ],
            },
            {
              segments: [
                {
                  text: "Named Cartel enemies will spawn outside of Villa Ultraviolet and their drops can be counted no matter the spawn location.",
                },
              ],
            },
            {
              segments: [
                { text: "Mayhem-exclusive drops (e.g., from Anathema, Scourge) " },
                { text: "do count", className: "font-bold" },
                { text: " for points." },
              ],
            },
          ],
        },
        { type: "heading", level: 3, segments: [{ text: "Proof of Drops" }], icon: "receipt", className: "mt-6" },
        {
          type: "paragraph",
          segments: [{ text: "To claim an item, you must:" }],
        },
        {
          type: "list",
          items: [
            {
              segments: [
                { text: "Provide a " },
                { text: "Twitch clip", href: "https://twitch.tv" },
                { text: " showing:" },
              ],
              subItems: [
                { segments: [{ text: "The item dropping from its dedicated source" }] },
                {
                  segments: [
                    { text: "The " },
                    { text: "item card", className: "font-bold" },
                    { text: " clearly on screen" },
                  ],
                },
              ],
            },
            {
              segments: [
                { text: "If the item drops out of bounds, you may visit the " },
                { text: "Lost Loot Machine", href: "https://borderlands.com/lost-loot" },
                { text: " to show the item card instead." },
              ],
              subItems: [
                { segments: [{ text: "Must be obvious the item dropped from the dedicated source." }] },
                {
                  segments: [
                    {
                      text: "Clip must show enemy kill, item dropping out of bounds, item card from Lost Loot machine.",
                    },
                  ],
                },
                {
                  segments: [
                    { text: "Use " },
                    { text: "Highlights", href: "https://twitch.tv/highlights" },
                    { text: " if the clip exceeds 60 seconds." },
                  ],
                },
              ],
            },
            {
              icon: "check",
              segments: [
                { text: "Arms Race drops " },
                { text: "don't need to be extracted", className: "font-bold" },
                { text: ", only proven to drop." },
              ],
            },
            {
              icon: "check",
              segments: [
                { text: "Proving Grounds final boss drops " },
                { text: "can be claimed with proper proof", className: "font-bold" },
                { text: "." },
              ],
            },
          ],
        },
        { type: "heading", level: 3, segments: [{ text: "Final Notes" }], icon: "speech-bubble", className: "mt-6" },
        {
          type: "list",
          items: [
            { segments: [{ text: "If something is not specifically stated as prohibited, it is allowed." }] },
            {
              segments: [
                { text: "Always ask the admin staff in " },
                { text: "Discord", href: "https://discord.com" },
                { text: " if you're unsure about a rule." },
              ],
            },
            { segments: [{ text: "Rules exist to protect the fun, fairness, and legitimacy of the event." }] },
            { segments: [{ text: "Have fun, support St. Jude, and may the loot gods bless your RNG!" }] },
          ],
        },
      ],
    },
  ]

  return (
    <div
      className="min-h-screen text-white py-8 px-4"
    >
      <div className="container mx-auto max-w-4xl">
        <Accordion type="single" collapsible className="w-full" defaultValue="what-is-the-hunt">
          <AccordionItem value="what-is-the-hunt">
        <AccordionTrigger className="text-left text-xl font-semibold text-white hover:no-underline data-[state=open]:text-[#BBFE17]">What Is The Hunt?</AccordionTrigger>
          <AccordionContent>
               <div className="mb-10">
          <p className="mb-4 text-white">
            The Hunt is more than a competition; it&apos;s a celebration of community, challenge, and charity.
          </p>
          <p className="mb-4 text-white">
            Vault Hunters from around the world come together for a thrilling Borderlands 3 scavenger hunt, racing to
            collect the rarest, most elusive loot the game has to offer. Every run starts fresh, from level one, with
            only skill, strategy, and a little RNG standing between you and the pride of being crowned Hunt Champion.
          </p>
          <p className="mb-4 text-white">But at the heart of it all is a far greater mission.</p>
          <p className="mb-4 text-white">
            <span className="font-bold">The Hunt proudly supports St. Jude Children&apos;s Research Hospital</span>, an
            organization that provides life-saving care for children fighting cancer and other serious diseases all at
            no cost to their families. By participating, streaming, and encouraging donations, you&apos;re helping fund
            research, treatment, and hope for thousands of families.
          </p>
          <p className="mb-4 text-white">
            Please actively promote your Tiltify campaign during the event using chat commands (e.g., !stjude or
            !donate), stream titles, overlays, or timers. You can find more donation tools and tips in the Resources
            channel on the Borderlands Community Fundraising Team Discord.
          </p>
          <p className="mb-2 text-white">Let’s keep the event fun, fair, and focused on the cause:</p>
          <ul className="list-disc list-inside ml-4 space-y-1 text-white">
            <li>Show good sportsmanship and respect your fellow competitors.</li>
            <li>Cheating or bending the rules will lead to disqualification.</li>
            <li>
              If you&apos;re ever unsure whether something is allowed, reach out to the admin team in Discord before taking
              action.
            </li>
          </ul>
          <p className="mt-4 text-white">
            This event is about <span className="font-bold italic">loot, laughs, and lifting others up!</span> Gear up,
            give back, and game on.
          </p>
        </div>
          </AccordionContent>
          </AccordionItem>
          <AccordionItem value="event-dates">
        <AccordionTrigger className="text-left text-xl font-semibold text-white hover:no-underline data-[state=open]:text-[#BBFE17]">Event Dates</AccordionTrigger>
          <AccordionContent>
               <div className="mb-10">
          <p className="mb-4 text-white">
          <span className="font-bold">Start:</span> Friday, August 15, 2025 – 9:00 AM EST
          </p>
          <p className="mb-4 text-white">
          <span className="font-bold">End:</span> Sunday, August 24, 2025 – 11:59:59 PM EST
          </p>
      
        </div>
          </AccordionContent>
          </AccordionItem>
          {rulesData.map((rule) => (
            <AccordionItem key={rule.id} value={rule.id} className="border-b border-gray-700">
              <AccordionTrigger className="text-left text-xl font-semibold text-white hover:no-underline data-[state=open]:text-[#BBFE17]">
                {rule.title}
              </AccordionTrigger>
              <AccordionContent className="p-4  rounded-b-md">
                <RenderContentBlocks blocks={rule.contentBlocks} />
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  )
}
