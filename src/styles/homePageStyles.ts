import { CSSProperties } from "react";

export const homePageStyles: { [key: string]: CSSProperties } = {
  container: { padding: "30px", direction: "rtl", fontFamily: "'Heebo', sans-serif", background: "#fcfdfe", minHeight: "100vh" },
  headerRow: { 
    display: "flex", justifyContent: "space-between", alignItems: "center", 
    background: "#ffffff", padding: "15px 35px", borderRadius: "18px", 
    marginBottom: "20px", border: "1px solid #eaedf0", boxShadow: "0 4px 12px rgba(0,0,0,0.02)" 
  },
  title: { fontSize: "24px", fontWeight: "800", color: "#2d3436", margin: 0 },
  logoutButton: { padding: "8px 20px", background: "#ffb3b3", color: "white", border: "none", borderRadius: "10px", cursor: "pointer", fontWeight: "bold" },
  createCard: { background: "#fff", padding: "20px", borderRadius: "18px", border: "1px solid #eaedf0", marginBottom: "20px" },
  input: { width: "100%", padding: "10px", borderRadius: "10px", border: "1px solid #dfe6e9", marginBottom: "10px", outline: "none" },
  submitBtn: { padding: "10px 24px", background: "#82ccdd", color: "white", border: "none", borderRadius: "10px", fontWeight: "bold", cursor: "pointer" },
  filtersRow: { display: "flex", gap: "10px", marginBottom: "20px", background: "#fff", padding: "15px", borderRadius: "15px", border: "1px solid #f1f1f1" },
  filterInput: { flex: 2, padding: "10px", borderRadius: "10px", border: "1px solid #dfe6e9", outline: "none" },
  filterSelect: { flex: 1, padding: "10px", borderRadius: "10px", border: "1px solid #dfe6e9", background: "white" },
  tableWrapper: { background: "white", borderRadius: "18px", border: "1px solid #eceef0", overflow: "hidden", boxShadow: "0 10px 30px rgba(0,0,0,0.02)" },
  table: { width: "100%", borderCollapse: "collapse", textAlign: "right" },
  th: { padding: "15px", background: "#f8f9fb", color: "#718096", fontSize: "14px" },
  td: { padding: "15px", borderBottom: "1px solid #f7f8f9", fontSize: "15px" },
  priorityBadge: { padding: "5px 12px", borderRadius: "8px", fontSize: "12px", fontWeight: "bold" },
  // הגדלתי את הרוחב של שדה התגובה כאן:
  commentInput: { padding: "10px", borderRadius: "8px", border: "1px solid #dfe6e9", width: "250px", marginLeft: "8px", outline: "none" },
  sendBtn: { background: "#82ccdd", color: "white", border: "none", padding: "10px 15px", borderRadius: "8px", cursor: "pointer" }
};
export default homePageStyles;