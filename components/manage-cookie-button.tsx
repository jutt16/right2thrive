"use client"

import { useCallback } from "react"

export default function ManageCookieButton() {
  const handleOpen = useCallback(() => {
    const event = new CustomEvent('openCookieSettings')
    window.dispatchEvent(event)
  }, [])

  return (
    <button
      type="button"
      onClick={handleOpen}
      className={`inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium h-10 px-4 py-2 w-full border border-input bg-background hover:bg-accent hover:text-accent-foreground`}
    >
      Manage Cookies
    </button>
  )
}
