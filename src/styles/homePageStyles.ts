export const homeStyles = {
    container: { padding: '20px', direction: 'rtl' as const, backgroundColor: '#f4f7f6', minHeight: '100vh' },
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' },
    card: { backgroundColor: '#fff', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' },
    formSection: { marginBottom: '30px', padding: '20px', backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #e0e0e0' },
    input: { width: '100%', padding: '12px', marginBottom: '10px', borderRadius: '8px', border: '1px solid #ddd', boxSizing: 'border-box' as const },
    select: { width: '100%', padding: '12px', marginBottom: '10px', borderRadius: '8px', border: '1px solid #ddd', backgroundColor: 'white' },
    submitBtn: { padding: '10px 20px', backgroundColor: '#2ecc71', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' as const },
    table: { width: '100%', borderCollapse: 'collapse' as const, marginTop: '20px' },
    th: { textAlign: 'right' as const, padding: '12px', borderBottom: '2px solid #eee', color: '#7f8c8d' },
    td: { padding: '12px', borderBottom: '1px solid #eee', verticalAlign: 'top' as const },
    successMessage: {
        backgroundColor: '#d4edda', color: '#155724', padding: '12px', borderRadius: '8px',
        marginBottom: '20px', border: '1px solid #c3e6cb', textAlign: 'center' as const, fontWeight: 'bold' as const
    },
    priorityBadge: (priorityId: number) => ({
        padding: '4px 8px', borderRadius: '4px', fontSize: '12px', color: 'white',
        backgroundColor: priorityId === 3 ? '#e74c3c' : priorityId === 2 ? '#f1c40f' : '#3498db'
    })
};