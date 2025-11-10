import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/admin'
import { Mail, Users, TrendingUp } from 'lucide-react'
import { NewsletterForm } from '@/components/admin/newsletter-form'

export const dynamic = 'force-dynamic'

export default async function AdminNewsletterPage() {
  await requireAdmin()

  // Count users with marketing emails enabled
  const subscribers = await prisma.user.count({
    where: { marketingEmails: true },
  })

  const totalUsers = await prisma.user.count()

  const stats = [
    {
      title: 'Newsletter Subscribers',
      value: subscribers,
      icon: Users,
      color: 'bg-blue-100 text-blue-600',
      description: 'Users subscribed to marketing emails',
    },
    {
      title: 'Total Users',
      value: totalUsers,
      icon: Users,
      color: 'bg-emerald-100 text-emerald-600',
      description: 'All registered users',
    },
    {
      title: 'Subscriber Rate',
      value: totalUsers > 0 ? `${Math.round((subscribers / totalUsers) * 100)}%` : '0%',
      icon: TrendingUp,
      color: 'bg-purple-100 text-purple-600',
      description: 'Percentage of users subscribed',
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-foreground">Newsletter</h2>
      </div>

      {/* Newsletter Form */}
      <NewsletterForm subscriberCount={subscribers} />

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        {stats.map((stat) => (
          <div key={stat.title} className="rounded-3xl border border-border bg-card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{stat.title}</p>
                <p className="mt-2 text-2xl font-semibold text-foreground">{stat.value}</p>
                <p className="mt-1 text-xs text-muted-foreground">{stat.description}</p>
              </div>
              <div className={`flex h-12 w-12 items-center justify-center rounded-full ${stat.color}`}>
                <stat.icon className="h-6 w-6" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Newsletter Info */}
      <div className="rounded-3xl border border-border bg-card p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <Mail className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">Email Marketing</h3>
            <p className="text-sm text-muted-foreground">Manage your newsletter subscribers and campaigns</p>
          </div>
        </div>

        <div className="space-y-4 rounded-2xl border border-border bg-muted/30 p-6">
          <p className="text-sm text-muted-foreground">
            Users can subscribe to your newsletter through:
          </p>
          <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
            <li>Homepage newsletter signup form</li>
            <li>Account settings page preferences</li>
          </ul>
        </div>

        <div className="mt-6 rounded-2xl border border-amber-300 bg-amber-50 p-4">
          <div className="flex items-start gap-3">
            <div className="text-amber-600">ℹ️</div>
            <div>
              <h4 className="font-medium text-amber-800">Integration Required</h4>
              <p className="mt-1 text-sm text-amber-700">
                To send actual newsletters, integrate with an email service provider.
                <strong className="block mt-2">Recommended: Resend (Easiest Setup)</strong>
              </p>
              <div className="mt-4 space-y-3">
                <div className="rounded-lg border border-amber-200 bg-white p-3">
                  <h5 className="font-semibold text-amber-800 mb-2">📧 Resend Setup (5 minutes):</h5>
                  <ol className="list-decimal list-inside text-sm text-amber-700 space-y-1">
                    <li>Go to <a href="https://resend.com" target="_blank" className="underline font-medium">resend.com</a> and sign up</li>
                    <li>Get your API key from the dashboard</li>
                    <li>Add to your <code className="bg-amber-100 px-1 rounded">.env</code>: <code className="bg-amber-100 px-1 rounded">RESEND_API_KEY=your_key_here</code></li>
                    <li>Install: <code className="bg-amber-100 px-1 rounded">npm install resend</code></li>
                  </ol>
                </div>
                
                <div className="rounded-lg border border-amber-200 bg-white p-3">
                  <h5 className="font-semibold text-amber-800 mb-2">Other Options:</h5>
                  <ul className="text-sm text-amber-700 space-y-1">
                    <li>• <strong>SendGrid</strong> - Good for high volume, free tier (100 emails/day)</li>
                    <li>• <strong>Mailchimp</strong> - Popular, great automation, free tier (500 contacts)</li>
                    <li>• <strong>ConvertKit</strong> - Best for creators, email sequences</li>
                  </ul>
                </div>
              </div>
              
              <p className="mt-3 text-xs text-amber-600">
                💡 <strong>Need help?</strong> Check the documentation or contact support once you choose a provider.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
