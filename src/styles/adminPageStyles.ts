import { CSSProperties } from "react";

export const adminPageStyles: { [key: string]: CSSProperties } = {
  container: {
    padding: 30,
    direction: "rtl",
    fontFamily: "Heebo, Arial, sans-serif",
    background: "#f7f7fa",
    minHeight: "100vh",
    maxWidth: 1200,
    margin: "0 auto",
  },
  headerRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  title: {
    fontWeight: 900,
    color: "#222",
    fontSize: 22,
  },
  backButton: {
    padding: "8px 14px",
    cursor: "pointer",
    background: "#222",
    color: "white",
    border: "none",
    borderRadius: 6,
    fontWeight: 700,
    boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
  },
  controlsWrapper: {
    marginBottom: 14,
  },
  controlsRow: {
    display: "flex",
    gap: 12,
    alignItems: "center",
    marginTop: 8,
    flexWrap: "wrap",
  },
  select: {
    padding: 8,
    borderRadius: 6,
    border: "1px solid #d0d5dd",
    background: "white",
  },
  input: {
    padding: 8,
    minWidth: 200,
    border: "1px solid #d0d5dd",
    borderRadius: 6,
    background: "white",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    background: "transparent",
  },
  tableWrapper: {
    overflowX: "auto",
    background: "white",
    borderRadius: 8,
    boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
    padding: 12,
  },
  theadTr: {
    textAlign: "left",
    borderBottom: "1px solid #eee",
  },
  theadTh: {
    padding: 10,
    background: "#fafafa",
    position: "sticky",
    top: 0,
    zIndex: 2,
    textAlign: "right",
  },
  th: {
    padding: 8,
  },
  tbodyTr: {
    borderBottom: "1px solid #f0f0f0",
  },
  rowEven: {
    background: "#ffffff",
  },
  rowOdd: {
    background: "#fbfbfc",
  },
  td: {
    padding: 8,
  },
  priorityBadge: {
    padding: "4px 8px",
    borderRadius: 6,
    fontWeight: 700,
    color: "white",
    display: "inline-block",
    minWidth: 36,
    textAlign: "center",
  },
  selectWide: {
    padding: 8,
    borderRadius: 6,
    minWidth: 120,
    border: "1px solid #d0d5dd",
    background: "white",
  },
  selectAgent: {
    padding: 8,
    borderRadius: 6,
    minWidth: 140,
    border: "1px solid #d0d5dd",
    background: "white",
  },
  commentArea: {
    width: "100%",
    minWidth: 160,
    borderRadius: 6,
    border: "1px solid #e6e6ea",
    padding: 6,
  },
  commentRow: {
    display: "flex",
    gap: 8,
    alignItems: "center",
  },
  sendButton: {
    padding: "8px 12px",
    background: "#2ecc71",
    color: "white",
    border: "none",
    borderRadius: 6,
    cursor: "pointer",
  },
};

export default adminPageStyles;
