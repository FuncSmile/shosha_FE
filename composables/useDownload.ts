export const useDownload = () => {
  /**
   * Download PDF blob as file
   */
  const downloadPdfBlob = (blob: Blob, filename: string) => {
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    window.URL.revokeObjectURL(url)
    document.body.removeChild(a)
  }

  /**
   * Download invoice PDF for an order
   */
  const downloadInvoice = async (orderId: string) => {
    try {
      const api = useApi()
      const blob = await api.get(`/orders/${orderId}/download-invoice`, {
        responseType: 'blob',
      }) as Blob

      const filename = `invoice-${orderId}-${new Date().toISOString().split('T')[0]}.pdf`
      downloadPdfBlob(blob, filename)

      return true
    } catch (error) {
      console.error('Failed to download invoice:', error)
      throw error
    }
  }

  /**
   * Download sales report PDF
   */
  const downloadSalesReport = async (params?: {
    startDate?: string
    endDate?: string
    userCode?: string
  }) => {
    try {
      const { getSalesReportPdf } = useReportsApi()
      const blob = await getSalesReportPdf(params) as Blob

      const dateStr = new Date().toISOString().split('T')[0]
      const filename = `sales-report-${dateStr}.pdf`
      downloadPdfBlob(blob, filename)

      return true
    } catch (error) {
      console.error('Failed to download sales report:', error)
      throw error
    }
  }

  /**
   * Download Excel file
   */
  const downloadExcel = (blob: Blob, filename: string) => {
    downloadPdfBlob(blob, filename)
  }

  return {
    downloadPdfBlob,
    downloadInvoice,
    downloadSalesReport,
    downloadExcel,
  }
}
