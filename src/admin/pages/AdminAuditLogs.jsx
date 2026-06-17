import React, { useEffect, useState, useMemo } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useAdminStore } from '../store/adminStore'
import DataGrid from '../components/DataGrid'

export const AdminAuditLogs = () => {
  const { accessToken } = useAuth()
  const { auditLogs, pagination, fetchAuditLogs, isLoading } = useAdminStore()

  // State
  const [currentPage, setCurrentPage] = useState(1)

  const loadLogs = () => {
    if (accessToken) {
      fetchAuditLogs(accessToken, {
        page: currentPage,
        limit: 15
      })
    }
  }

  useEffect(() => {
    loadLogs()
  }, [accessToken, currentPage])

  const columns = useMemo(() => [
    {
      key: 'createdAt',
      label: 'Timestamp',
      width: '180px',
      render: (row) => new Date(row.createdAt).toLocaleString()
    },
    {
      key: 'admin',
      label: 'Operator',
      render: (row) => (
        <div>
          <span className="font-bold block">{row.admin?.fullName || 'SYSTEM'}</span>
          <span className="text-[10px] text-[#7C766C] block">{row.admin?.email || 'N/A'}</span>
        </div>
      )
    },
    { key: 'action', label: 'Action Protocol' },
    {
      key: 'details',
      label: 'Operation Details',
      render: (row) => {
        const detStr = row.details ? JSON.stringify(row.details) : '{}'
        return <span className="normal-case font-mono text-[10px] text-[#5C5C5C] break-all max-w-sm block truncate" title={detStr}>{detStr}</span>
      }
    },
    { key: 'ipAddress', label: 'IP Location Address' }
  ], [accessToken])

  return (
    <div className="space-y-8 uppercase">
      {/* Header */}
      <div>
        <h1 className="font-display text-2xl md:text-3xl font-extrabold tracking-tight text-[#0A0A0A]">
          SYSTEM AUDIT LOGS
        </h1>
        <p className="font-body text-[10px] text-[#7C766C] tracking-widest mt-1">
          OPERATOR TRACEABILITY REGISTRY
        </p>
      </div>

      {/* DataGrid */}
      <DataGrid
        columns={columns}
        items={auditLogs}
        isLoading={isLoading}
        pagination={pagination}
        onPageChange={setCurrentPage}
        emptyMessage="No traceability log entries recorded."
      />

    </div>
  )
}

export default AdminAuditLogs
