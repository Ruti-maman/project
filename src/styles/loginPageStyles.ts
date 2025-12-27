export const loginStyles = {
    container: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#f8f9fa',
        direction: 'rtl' as const
    },
    card: {
        padding: '30px',
        backgroundColor: '#fff',
        borderRadius: '10px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        width: '320px',
        textAlign: 'center' as const
    },
    title: {
        marginBottom: '20px',
        fontSize: '24px',
        color: '#333'
    },
    input: {
        width: '100%',
        padding: '10px',
        marginBottom: '10px',
        borderRadius: '5px',
        border: '1px solid #ddd',
        boxSizing: 'border-box' as const
    },
    button: {
        width: '100%',
        padding: '10px',
        backgroundColor: '#007bff',
        color: '#fff',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        fontSize: '16px'
    },
    error: {
        color: 'red',
        fontSize: '14px',
        marginBottom: '10px'
    }
};