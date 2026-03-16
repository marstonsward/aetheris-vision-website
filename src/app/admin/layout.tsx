export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ colorScheme: 'light', backgroundColor: '#f9fafb', color: '#111827', minHeight: '100vh' }}>
      {children}
    </div>
  )
}
