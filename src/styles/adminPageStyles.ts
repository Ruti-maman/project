import { CSSProperties } from "react";

export const adminPageStyles: { [key: string]: CSSProperties } = {
  container: { padding: "30px", direction: "rtl", fontFamily: "'Heebo', sans-serif", background: "#f8fafd", minHeight: "100vh" },
  headerRow: { 
    display: "flex", justifyContent: "space-between", alignItems: "center", 
    background: "#fff", padding: "15px 35px", borderRadius: "18px", 
    marginBottom: "20px", border: "1px solid #ebf0f3", boxShadow: "0 4px 12px rgba(0,0,0,0.02)" 
  },
  title: { fontSize: "24px", fontWeight: "800", color: "#2d3436", margin: 0 },
  logoutButton: { padding: "8px 20px", background: "#ffb3b3", color: "white", border: "none", borderRadius: "10px", cursor: "pointer", fontWeight: "bold" },
  filtersRow: { display: "flex", gap: "10px", marginBottom: "20px", background: "#fff", padding: "15px", borderRadius: "15px", border: "1px solid #f1f1f1" },
  input: { flex: 2, padding: "10px 15px", borderRadius: "10px", border: "1px solid #dfe6e9", outline: "none" },
  select: { flex: 1, padding: "10px", borderRadius: "10px", border: "1px solid #dfe6e9", background: "white", cursor: "pointer" },
  tableWrapper: { background: "white", borderRadius: "20px", border: "1px solid #f1f1f1", overflow: "hidden", boxShadow: "0 10px 30px rgba(0,0,0,0.02)" },
  table: { width: "100%", borderCollapse: "collapse", textAlign: "right" },
  th: { padding: "15px", background: "#fdfdfe", color: "#636e72", fontSize: "13px", fontWeight: "600", borderBottom: "1px solid #f1f1f1" },
  td: { padding: "15px", fontSize: "14px", borderBottom: "1px solid #fafafa" },
  priorityBadge: { padding: "5px 12px", borderRadius: "8px", fontSize: "12px", fontWeight: "bold" },
  statusSelect: { padding: "5px", borderRadius: "8px", border: "1px solid #dfe6e9", fontSize: "13px" },
  commentInput: { padding: "8px", borderRadius: "8px", border: "1px solid #dfe6e9", width: "130px", marginLeft: "5px" },
  sendBtn: { background: "#a29bfe", color: "white", border: "none", padding: "8px 12px", borderRadius: "8px", cursor: "pointer" },
  detailsBtn: { color: "#74b9ff", background: "#f0f7ff", border: "none", padding: "6px 15px", borderRadius: "8px", fontWeight: "bold", cursor: "pointer" }
};
export default adminPageStyles;