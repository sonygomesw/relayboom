import React from 'react'

// Skeleton ultra-léger pour navigation instantanée
export const DashboardSkeleton = () => (
  <div className="min-h-screen bg-gray-50 flex animate-pulse">
    {/* Sidebar Skeleton */}
    <div className="w-96 bg-white border-r border-gray-200 fixed left-0 top-0 h-full">
      <div className="p-8">
        <div className="h-8 bg-gray-200 rounded-lg mb-8"></div>
        <div className="space-y-4">
          <div className="h-12 bg-gray-200 rounded-lg"></div>
          <div className="h-12 bg-gray-200 rounded-lg"></div>
          <div className="h-12 bg-gray-200 rounded-lg"></div>
          <div className="h-12 bg-gray-200 rounded-lg"></div>
        </div>
      </div>
    </div>

    {/* Main Content Skeleton */}
    <div className="flex-1 ml-96 p-12">
      <div className="h-12 bg-gray-200 rounded-lg mb-8"></div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="bg-white rounded-2xl p-6 border border-gray-200">
            <div className="flex items-start gap-4">
              <div className="w-20 h-20 bg-gray-200 rounded-xl"></div>
              <div className="flex-1 space-y-3">
                <div className="h-6 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
)

export const ClipsSkeleton = () => (
  <div className="min-h-screen bg-gray-50 flex animate-pulse">
    <div className="w-96 bg-white border-r border-gray-200 fixed left-0 top-0 h-full">
      <div className="p-8">
        <div className="h-8 bg-gray-200 rounded-lg mb-8"></div>
        <div className="space-y-4">
          <div className="h-12 bg-gray-200 rounded-lg"></div>
          <div className="h-12 bg-gray-200 rounded-lg"></div>
          <div className="h-12 bg-gray-200 rounded-lg"></div>
        </div>
      </div>
    </div>

    <div className="flex-1 ml-96 p-8">
      <div className="h-10 bg-gray-200 rounded-lg mb-6"></div>
      
      {/* Stats Cards Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-white rounded-xl p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-20"></div>
                <div className="h-8 bg-gray-200 rounded w-16"></div>
              </div>
              <div className="w-12 h-12 bg-gray-200 rounded-xl"></div>
            </div>
          </div>
        ))}
      </div>

      {/* Clips List Skeleton */}
      <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-200">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex-1 space-y-2">
                <div className="h-6 bg-gray-200 rounded w-1/3"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
              <div className="w-20 h-8 bg-gray-200 rounded"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
)

export const MissionsSkeleton = () => (
  <div className="min-h-screen bg-gray-50 p-12 animate-pulse">
    <div className="h-12 bg-gray-200 rounded-lg mb-8"></div>
    <div className="space-y-6">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-start gap-6">
            <div className="w-32 h-32 bg-gray-200 rounded-xl"></div>
            <div className="flex-1 space-y-4">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <div className="h-6 bg-gray-200 rounded w-1/3"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                </div>
                <div className="text-right space-y-2">
                  <div className="h-8 bg-gray-200 rounded w-20"></div>
                  <div className="h-4 bg-gray-200 rounded w-16"></div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                <div className="h-2 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
)

// Skeleton générique ultra-léger
export const QuickSkeleton = ({ lines = 3 }: { lines?: number }) => (
  <div className="animate-pulse space-y-3">
    {Array.from({ length: lines }).map((_, i) => (
      <div key={i} className="h-4 bg-gray-200 rounded"></div>
    ))}
  </div>
) 