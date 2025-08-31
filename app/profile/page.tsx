import { ProfileHeader } from "@/components/profile/profile-header"
import { ProfileForm } from "@/components/profile/profile-form"
import { ProfileStats } from "@/components/profile/profile-stats"

export default function ProfilePage() {
  return (
    <div className="space-y-6">
      <ProfileHeader />
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <ProfileForm />
        </div>
        <div>
          <ProfileStats />
        </div>
      </div>
    </div>
  )
}
