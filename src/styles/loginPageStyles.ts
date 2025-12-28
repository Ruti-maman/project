import { CSSProperties } from "react";

export const authStyles: { [key: string]: CSSProperties } = {
  wrapper: { 
    display: 'flex', justifyContent: 'center', alignItems: 'center', 
    height: '100vh', background: '#f8fafd', direction: 'rtl', fontFamily: 'Heebo, sans-serif' 
  },
  card: { 
    background: 'white', padding: '40px', borderRadius: '22px', 
    boxShadow: '0 12px 35px rgba(0,0,0,0.06)', width: '360px', border: '1px solid #f1f1f1'
  },
  title: { textAlign: 'center', marginBottom: '10px', color: '#2d3436', fontWeight: '800' },
  subtitle: { textAlign: 'center', color: '#999', marginBottom: '30px', fontSize: '14px' },
  formGroup: { marginBottom: '15px' },
  label: { display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600', color: '#636e72' },
  input: { 
    width: '100%', padding: '12px 15px', borderRadius: '12px', border: '1px solid #dfe6e9', 
    outline: 'none', fontSize: '15px', boxSizing: 'border-box' 
  },
  loginBtn: { 
    width: '100%', padding: '14px', background: '#82ccdd', color: 'white', 
    border: 'none', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer', 
    fontSize: '16px', boxShadow: '0 5px 15px rgba(130, 204, 221, 0.3)', marginTop: '10px'
  },
  registerBtn: { 
    width: '100%', padding: '14px', background: '#a29bfe', color: 'white', 
    border: 'none', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer', 
    fontSize: '16px', boxShadow: '0 5px 15px rgba(162, 155, 254, 0.3)', marginTop: '10px'
  },
  footer: { marginTop: '25px', textAlign: 'center', borderTop: '1px solid #f1f1f1', paddingTop: '20px' },
  link: { fontWeight: 'bold', textDecoration: 'none', fontSize: '15px', display: 'inline-block', marginTop: '5px' }
};

export default authStyles;