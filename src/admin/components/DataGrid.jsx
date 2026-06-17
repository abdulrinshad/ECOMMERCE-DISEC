import React from 'react'

export const DataGrid = ({
  columns = [],
  items = [],
  isLoading = false,
  pagination = {},
  onPageChange,
  emptyMessage = 'No records found in this category.'
}) => {
  return (
    <div className="w-full bg-white border border-[#D8D3CA] overflow-hidden">
      
      {/* Scrollable Table Wrapper */}
      <div className="w-full overflow-x-auto">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="bg-[#0A0A0A] text-white border-b border-[#D8D3CA]">
              {columns.map((col) => (
                <th 
                  key={col.key}
                  className="px-6 py-4 font-display text-[9px] font-extrabold uppercase tracking-widest"
                  style={col.width ? { width: col.width } : {}}
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#D8D3CA]/60">
            {isLoading ? (
              <tr>
                <td colSpan={columns.length} className="px-6 py-12 text-center">
                  <div className="w-6 h-6 border border-t-[#1A3C2E] border-r-transparent border-b-[#1A3C2E] border-l-transparent rounded-full animate-spin mx-auto mb-3" />
                  <span className="font-display text-[8px] font-bold tracking-widest text-[#7C766C] uppercase">
                    Querying system index...
                  </span>
                </td>
              </tr>
            ) : items.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-6 py-12 text-center">
                  <span className="font-body text-xs text-[#7C766C] uppercase tracking-wider block">
                    {emptyMessage}
                  </span>
                </td>
              </tr>
            ) : (
              items.map((row, idx) => (
                <tr 
                  key={row._id || row.id || idx}
                  className="hover:bg-[#F2EFE9]/40 transition-colors"
                >
                  {columns.map((col) => (
                    <td 
                      key={col.key}
                      className="px-6 py-4 font-body text-xs text-[#0A0A0A] tracking-wide"
                    >
                      {col.render ? col.render(row) : row[col.key]}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls Footer */}
      {!isLoading && pagination && pagination.totalPages > 1 && (
        <div className="bg-white border-t border-[#D8D3CA] px-6 py-4 flex items-center justify-between font-display text-[9px] font-extrabold uppercase tracking-widest">
          <button
            disabled={pagination.page === 1}
            onClick={() => onPageChange && onPageChange(pagination.page - 1)}
            className="px-3 py-1.5 border border-[#D8D3CA] bg-white text-[#0A0A0A] hover:bg-[#F2EFE9] disabled:opacity-30 cursor-pointer"
          >
            ← PREV
          </button>
          
          <span className="text-[#7C766C]">
            PAGE {pagination.page} OF {pagination.totalPages}
          </span>
          
          <button
            disabled={pagination.page === pagination.totalPages}
            onClick={() => onPageChange && onPageChange(pagination.page + 1)}
            className="px-3 py-1.5 border border-[#D8D3CA] bg-white text-[#0A0A0A] hover:bg-[#F2EFE9] disabled:opacity-30 cursor-pointer"
          >
            NEXT →
          </button>
        </div>
      )}

    </div>
  )
}

export default React.memo(DataGrid)
