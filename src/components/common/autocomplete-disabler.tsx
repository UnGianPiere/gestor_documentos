'use client'

import { useEffect } from 'react'

export default function AutocompleteDisabler() {
  useEffect(() => {
    // Disable autocomplete for all input fields
    const inputs = document.querySelectorAll('input')
    inputs.forEach((input) => {
      input.setAttribute('autocomplete', 'off')
      input.setAttribute('data-form-type', 'other')
    })
  }, [])

  return null
}


