import ClientsTable from '@/components/tables/clientsTable'
import CompanyTable from '@/components/tables/companyTable'
import ExportSampleTable from '@/components/tables/customers'
import React from 'react'

export default function ClientsPage() {
  return (
    <div>
      <ClientsTable/>
      <ExportSampleTable />
    </div>
  )
}
