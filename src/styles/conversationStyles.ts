export const conversationStyles = {
    discussionWrapper: { 
        marginTop: '15px', 
        padding: '20px', 
        backgroundColor: '#f9fafb', 
        borderRadius: '12px',
        borderRight: '5px solid #3498db'
    },
    messageBubble: (isStaff: boolean) => ({ 
        padding: '12px 16px', 
        backgroundColor: isStaff ? '#ebf8ff' : '#ffffff', 
        borderRadius: '10px', 
        marginBottom: '12px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
        border: isStaff ? '1px solid #bee3f8' : '1px solid #edf2f7',
        maxWidth: '90%'
    }),
    headerRow: {
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        marginBottom: '8px'
    },
    senderName: { fontWeight: '700' as const, color: '#2d3748', fontSize: '14px' },
    badge: (isStaff: boolean) => ({
        fontSize: '11px',
        padding: '2px 8px',
        borderRadius: '20px',
        backgroundColor: isStaff ? '#3182ce' : '#718096',
        color: 'white',
        fontWeight: '600' as const
    }),
    content: { fontSize: '15px', color: '#4a5568', lineHeight: '1.5' },
    inputArea: { marginTop: '15px', display: 'flex', flexDirection: 'column' as const, gap: '10px' },
    textField: { 
        width: '100%', padding: '12px', borderRadius: '8px', 
        border: '1px solid #e2e8f0', boxSizing: 'border-box' as const,
        fontFamily: 'inherit'
    },
    sendButton: { 
        alignSelf: 'flex-start', padding: '10px 20px', backgroundColor: '#3182ce', 
        color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' as const 
    }
};