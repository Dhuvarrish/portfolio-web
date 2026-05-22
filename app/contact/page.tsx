import Image from "next/image"
import { Mail } from "lucide-react"
import { FaGithub, FaLinkedin } from "react-icons/fa"

const links = [
  {
    label: "Email",
    title: "Email",
    href: "mailto:dhuvarrish35@gmail.com",
    icon: Mail,
    display: "dhuvarrish35@gmail.com",
  },
  {
    label: "LinkedIn",
    title: "LinkedIn",
    href: "https://www.linkedin.com/in/Dhuvarrish",
    icon: FaLinkedin,
    display: "linkedin.com/in/Dhuvarrish",
  },
]

export default function ContactPage() {
  return (
    <div className="w-full py-8 md:py-10 space-y-10 max-w-xl">
      <div className="space-y-2">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Get in touch</h1>
        <p className="text-sm text-muted-foreground leading-relaxed">
          I’m open to new opportunities and happy to have a conversation if there’s a good fit.
        </p>
      </div>

      <div className="flex flex-col gap-3">
        {links.map(({ label, title, href, icon: Icon, display }) => (
          <a
            key={label}
            title={title}
            href={href}
            target={href.startsWith("mailto") ? undefined : "_blank"}
            rel="noopener noreferrer"
            className="flex items-center gap-3 group w-fit"
          >
            <Icon className="size-4 text-muted-foreground shrink-0" />
            <span>{title} : </span>
            <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">{display}</span>
          </a>
        ))}
      </div>

      <div className="w-fit rounded-2xl border border-border bg-muted/30 px-6 py-5 space-y-3 flex flex-col items-center">
        <Image src="/thank-you.gif" alt="Thank you" width={480} height={480} unoptimized />
      </div>
    </div>
  )
}
