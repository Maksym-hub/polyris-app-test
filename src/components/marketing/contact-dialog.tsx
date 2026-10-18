"use client"

import { Mail, Phone, Smartphone, ArrowUpRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
  Popover,
  PopoverContent,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover"

const contactItems = [
  {
    icon: Mail,
    iconClass: "text-blue-500",
    label: "Email",
    value: "info@quintagroup.com",
    href: "mailto:info@quintagroup.com",
  },
  {
    icon: Phone,
    iconClass: "text-green-500",
    label: "Phone (US)",
    value: "1-646-980-4675",
    href: "tel:+16469804675",
  },
  {
    icon: Smartphone,
    iconClass: "text-purple-500",
    label: "Mobile (US)",
    value: "1-610-234-7939",
    href: "tel:+16102347939",
  },
]

export function ContactDialog() {
  return (
    <Popover>
      <PopoverTrigger render={<Button variant="outline" size="sm" />}>Contact us</PopoverTrigger>
      <PopoverContent align="end" sideOffset={8} className="w-80">
        <PopoverHeader className="px-0.5 pb-0.5">
          <PopoverTitle className="text-sm font-semibold">Get in touch</PopoverTitle>
        </PopoverHeader>

        <div className="flex flex-col gap-1.5">
          {contactItems.map(({ icon: Icon, iconClass, label, value, href }) => (
            <a
              key={label}
              href={href}
              className="group bg-muted/50 hover:bg-muted flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors"
            >
              <div className="bg-background ring-border flex h-8 w-8 shrink-0 items-center justify-center rounded-md ring-1">
                <Icon className={cn("h-4 w-4", iconClass)} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-muted-foreground text-[10px] font-semibold tracking-widest uppercase">
                  {label}
                </p>
                <p className="text-foreground truncate text-sm font-medium">{value}</p>
              </div>
              <ArrowUpRight className="text-muted-foreground h-3.5 w-3.5 shrink-0 opacity-30 transition-opacity group-hover:opacity-100" />
            </a>
          ))}
        </div>

        <Separator />

        <p className="text-muted-foreground px-0.5 text-[11px] leading-relaxed">
          2CheckOut.com Inc. (Ohio, USA) is an authorized retailer of goods and services provided by
          Quintagroup.
        </p>
      </PopoverContent>
    </Popover>
  )
}
