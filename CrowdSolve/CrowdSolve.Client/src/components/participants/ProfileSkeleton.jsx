
import { Skeleton } from '@/components/ui/skeleton'

const ProfileSkeleton = () => (
  <div className="min-h-screen bg-background">
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1">
          <Skeleton className="w-[296px] h-[296px] rounded-full mb-4" />
          <Skeleton className="h-6 w-3/4 mb-2" />
          <Skeleton className="h-4 w-1/2 mb-4" />
          <Skeleton className="h-20 w-full mb-4" />
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-4 w-full mb-2" />
          ))}
        </div>
        <div className="lg:col-span-3">
          <Skeleton className="h-[600px] w-full" />
        </div>
      </div>
    </div>
  </div>
)

export default ProfileSkeleton