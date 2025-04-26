export function exportToCsv(data, filename) {
    if (!data || !data.length) {
      console.error("No data to export")
      return
    }
  
    // Get headers from the first object
    const headers = Object.keys(data[0])
  
    // Create CSV content
    const csvContent = [
      // Headers row
      headers.join(","),
      // Data rows
      ...data.map((row) =>
        headers
          .map((header) => {
            // Handle values that need quotes (contain commas, quotes, or newlines)
            const value = row[header] === null || row[header] === undefined ? "" : String(row[header])
            const needsQuotes = value.includes(",") || value.includes('"') || value.includes("\n")
  
            // Escape quotes by doubling them and wrap in quotes if needed
            return needsQuotes ? `"${value.replace(/"/g, '""')}"` : value
          })
          .join(","),
      ),
    ].join("\n")
  
    // Create a blob and download link
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
  
    // Set up download attributes
    link.setAttribute("href", url)
    link.setAttribute("download", `${filename}.csv`)
    link.style.visibility = "hidden"
  
    // Add to document, trigger download, and clean up
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }
  