import { notFound } from "next/navigation"
import { Mail, Linkedin, Twitter, Award, BookOpen, Calendar } from "lucide-react"
import type { Metadata } from "next"

// Sample author data - in production, this would come from a database or CMS
const authors = {
  "john-smith": {
    name: "John Smith",
    slug: "john-smith",
    title: "Senior Automotive Analyst",
    bio: "John has over 15 years of experience in automotive journalism and analysis. He specializes in vehicle comparisons, safety ratings, and emerging automotive technologies. His work has been featured in leading automotive publications.",
    image: "/professional-headshot.png",
    credentials: [
      "ASE Certified Master Technician",
      "Automotive Journalism Award Winner 2023",
      "Former Editor at Motor Trend Magazine",
    ],
    expertise: ["Vehicle Safety", "Electric Vehicles", "Performance Analysis", "Consumer Reports"],
    social: {
      email: "john.smith@example.com",
      linkedin: "https://linkedin.com/in/johnsmith",
      twitter: "https://twitter.com/johnsmith",
    },
    stats: {
      articlesWritten: 247,
      yearsExperience: 15,
      vehiclesReviewed: 500,
    },
  },
}

type AuthorSlug = keyof typeof authors

export async function generateMetadata({
  params,
}: {
  params: { slug: string }
}): Promise<Metadata> {
  const author = authors[params.slug as AuthorSlug]
  if (!author) return { title: "Author Not Found" }

  return {
    title: `${author.name} - ${author.title}`,
    description: author.bio,
  }
}

export default function AuthorPage({ params }: { params: { slug: string } }) {
  const author = authors[params.slug as AuthorSlug]

  if (!author) {
    notFound()
  }

  return (
    <div className="container mx-auto px-4 py-16 max-w-5xl">
      {/* Header */}
      <div className="mb-12">
        <div className="flex flex-col md:flex-row gap-8 items-start">
          {/* Author Image */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/20 to-blue-600/20 rounded-2xl blur-2xl" />
            <img
              src={author.image || "/placeholder.svg"}
              alt={author.name}
              className="relative w-48 h-48 rounded-2xl object-cover border-2 border-white/10"
            />
          </div>

          {/* Author Info */}
          <div className="flex-1">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-2 text-balance">{author.name}</h1>
            <p className="text-xl text-cyan-400 mb-4">{author.title}</p>
            <p className="text-slate-300 text-lg leading-relaxed mb-6">{author.bio}</p>

            {/* Social Links */}
            <div className="flex gap-3">
              {author.social.email && (
                <a
                  href={`mailto:${author.social.email}`}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-slate-300 hover:text-cyan-400 hover:border-cyan-400/30 transition-colors"
                >
                  <Mail className="w-4 h-4" />
                  <span className="text-sm">Email</span>
                </a>
              )}
              {author.social.linkedin && (
                <a
                  href={author.social.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-slate-300 hover:text-cyan-400 hover:border-cyan-400/30 transition-colors"
                >
                  <Linkedin className="w-4 h-4" />
                  <span className="text-sm">LinkedIn</span>
                </a>
              )}
              {author.social.twitter && (
                <a
                  href={author.social.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-slate-300 hover:text-cyan-400 hover:border-cyan-400/30 transition-colors"
                >
                  <Twitter className="w-4 h-4" />
                  <span className="text-sm">Twitter</span>
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="p-6 rounded-xl bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-white/10">
          <div className="flex items-center gap-3 mb-2">
            <BookOpen className="w-5 h-5 text-cyan-400" />
            <span className="text-sm text-slate-400">Articles Written</span>
          </div>
          <p className="text-3xl font-bold text-white">{author.stats.articlesWritten}</p>
        </div>
        <div className="p-6 rounded-xl bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-white/10">
          <div className="flex items-center gap-3 mb-2">
            <Calendar className="w-5 h-5 text-green-400" />
            <span className="text-sm text-slate-400">Years Experience</span>
          </div>
          <p className="text-3xl font-bold text-white">{author.stats.yearsExperience}</p>
        </div>
        <div className="p-6 rounded-xl bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-white/10">
          <div className="flex items-center gap-3 mb-2">
            <Award className="w-5 h-5 text-purple-400" />
            <span className="text-sm text-slate-400">Vehicles Reviewed</span>
          </div>
          <p className="text-3xl font-bold text-white">{author.stats.vehiclesReviewed}+</p>
        </div>
      </div>

      {/* Credentials */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
          <Award className="w-6 h-6 text-cyan-400" />
          Credentials & Recognition
        </h2>
        <ul className="space-y-3">
          {author.credentials.map((credential, index) => (
            <li key={index} className="flex items-start gap-3 p-4 rounded-lg bg-white/5 border border-white/10">
              <div className="w-2 h-2 rounded-full bg-cyan-400 mt-2" />
              <span className="text-slate-300">{credential}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Expertise */}
      <div>
        <h2 className="text-2xl font-bold text-white mb-6">Areas of Expertise</h2>
        <div className="flex flex-wrap gap-3">
          {author.expertise.map((area, index) => (
            <span
              key={index}
              className="px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-400/30 text-cyan-300 text-sm font-medium"
            >
              {area}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
