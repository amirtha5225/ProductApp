import { useState } from "react";

function Table({ columns, data }) {
  const [search, setSearch] = useState("");
  const [sortConfig, setSortConfig] = useState(null);

  const filteredData = data.filter((item) => {
    return columns.some((col) => {
      const value = item[col.accessor];
      if (value === undefined || value === null) return false;

      return String(value)
        .toLowerCase()
        .includes(search.toLowerCase());
    });
  });

  const sortedData = [...filteredData].sort((a, b) => {
    if (!sortConfig) return 0;

    const { key, direction } = sortConfig;

    if (a[key] < b[key]) return direction === "asc" ? -1 : 1;
    if (a[key] > b[key]) return direction === "asc" ? 1 : -1;

    return 0;
  });

  const handleSort = (key) => {
    setSortConfig((prev) => {
      if (prev && prev.key === key && prev.direction === "asc") {
        return { key, direction: "desc" };
      }
      return { key, direction: "asc" };
    });
  };

  return (
    <div className="table-container">
      <input
        className="search-input"
        placeholder="Search..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <table className="data-table">
        <thead>
          <tr>
            {columns.map((col) => (
              <th
                key={col.accessor || col.key}
                onClick={() => handleSort(col.accessor || col.key)}
              >
                {col.header || col.label}
              </th>
            ))}
            {data.some(row => row.actions !== undefined) && <th>Actions</th>}
          </tr>
        </thead>

        <tbody>
          {sortedData.length === 0 ? (
            <tr>
              <td colSpan={columns.length + 1}>No data</td>
            </tr>
          ) : (
            sortedData.map((row, index) => (
              <tr key={row.id || index} className={row.deleted_at ? "deleted-row" : ""}>
                {columns.map((col) => (
                  <td key={col.accessor || col.key}>
                    {col.render ? col.render(row[col.accessor || col.key], row) : row[col.accessor || col.key]}
                  </td>
                ))}
                {row.actions && <td className="actions-cell">{row.actions}</td>}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default Table;