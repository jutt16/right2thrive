'use client'

import { useEffect } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'

export default function Analytics() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    const url = `${pathname}?${searchParams}`
    if (window.gtag) {
      window.gtag('event', 'page_view', {
        page_path: url,
      })
    }
  }, [pathname, searchParams])

  return null
}
