/**
 * Export utilities for CSV and PDF generation
 */

/**
 * Export data to CSV file
 * @param data - Array of objects to export
 * @param filename - Name of the exported file
 * @param columns - Optional column mapping (label -> key)
 */
export function exportToCSV(
  data: any[],
  filename: string,
  columns?: { label: string; key: string }[]
): void {
  if (!data || data.length === 0) {
    console.warn('No data to export')
    return
  }

  // Determine columns from data if not provided
  const keys = columns
    ? columns.map((c) => c.key)
    : Object.keys(data[0])
  
  const headers = columns
    ? columns.map((c) => c.label)
    : keys

  // Create CSV content
  const csvContent = [
    headers.join(','),
    ...data.map((row) =>
      keys.map((key) => {
        const value = row[key]
        // Handle arrays, objects, and strings with commas
        if (Array.isArray(value)) {
          return `"${value.join('; ')}"`
        }
        if (typeof value === 'object' && value !== null) {
          return `"${JSON.stringify(value)}"`
        }
        const str = String(value ?? '')
        return str.includes(',') || str.includes('"') ? `"${str}"` : str
      }).join(',')
    ),
  ].join('\n')

  // Create blob and download
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)
  
  link.setAttribute('href', url)
  link.setAttribute('download', `${filename}_${new Date().toISOString().split('T')[0]}.csv`)
  link.style.visibility = 'hidden'
  
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

/**
 * Format currency for display
 */
export function formatCurrency(amount: number, currency: string = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount)
}

/**
 * Format date for display
 */
export function formatDate(date: string | Date, format: string = 'short'): string {
  const d = typeof date === 'string' ? new Date(date) : date
  
  if (format === 'short') {
    return d.toLocaleDateString()
  }
  if (format === 'long') {
    return d.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }
  if (format === 'time') {
    return d.toLocaleTimeString()
  }
  
  return d.toLocaleString()
}

/**
 * Download helper for simple use cases
 */
export function downloadFile(content: string, filename: string, mimeType: string): void {
  const blob = new Blob([content], { type: mimeType })
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)
  
  link.setAttribute('href', url)
  link.setAttribute('download', filename)
  link.style.visibility = 'hidden'
  
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}
