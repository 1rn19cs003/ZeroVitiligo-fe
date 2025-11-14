"use client";
import { useEffect, useState } from "react";
import styles from "./styles.module.css";
import useDoctorStore from "@/store/useDoctorStore";
import { MultiSelectDropdown } from '@/app/doctor/MultiselectDropdown';
import { Search } from "lucide-react";
import { authService } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { usePatients } from '../../hooks/usePatients'

export default function DoctorTable() {
  const { columns, filters, setData, setColumns } = useDoctorStore();
  const [selectedColumns, setSelectedColumns] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();
  const { data = [], isLoading } = usePatients();

  useEffect(() => {
    if (!authService.isAuthenticated()) {
      router.push("/login");
    }
  }, [router]);

  useEffect(() => {
    if (data.length > 0) {
      setData(data);
      setColumns(Object.keys(data[0]));
      setSelectedColumns(Object.keys(data[0]));
    }
  }, [data, setData, setColumns]);

  const handleRowClick = (patient) => {
    router.push(`/doctor/patient/${patient.id}`);
  };

  const filteredData = data?.filter((row) => {
    const matchesFilters = Object.entries(filters).every(([key, val]) => {
      if (!selectedColumns.includes(key)) return true;
      return val === ""
        ? true
        : String(row[key]).toLowerCase().includes(val.toLowerCase());
    });

    const matchesSearch = searchQuery === "" || selectedColumns.some((col) =>
      String(row[col]).toLowerCase().includes(searchQuery.toLowerCase())
    );

    return matchesFilters && matchesSearch;
  });

  return (
    <div className={styles.container}>
      <section className={styles.headerSection}>
        <h1>Doctor Dashboard</h1>
        <p>
          Manage patient data efficiently with real-time filters and a responsive layout.
        </p>
      </section>

      <section className={styles.filterSection}>
        <div className={styles.filterRow}>
          <div className={styles.searchContainer}>
            <label htmlFor="search" className={styles.searchLabel}>
              Search
            </label>
            <div className={styles.searchInputWrapper}>
              <Search className={styles.searchIcon} />
              <input
                id="search"
                type="text"
                placeholder="Search across all columns..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={styles.searchInput}
              />
            </div>
          </div>

          <div className={styles.columnFilterContainer}>
            <MultiSelectDropdown
              options={columns}
              selected={selectedColumns}
              onChange={setSelectedColumns}
              label="Select Columns to Display"
            />
          </div>
        </div>
      </section>

      <section className={styles.tableSection}>
        {isLoading ? (
          <div className={styles.loaderContainer}>
            <div className={styles.loader}></div>
            <p className={styles.loaderText}>Loading patient data...</p>
          </div>
        ) : (
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  {selectedColumns.map((col) => (
                    <th key={col}>{col}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {!isLoading && filteredData.length > 0 ? (
                  filteredData.map((row, i) => (
                    <tr
                      key={i}
                      onClick={() => handleRowClick(row)}
                      className={styles.clickableRow}
                    >
                      {selectedColumns.map((col) => (
                        <td key={col}>{row[col]}</td>
                      ))}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={selectedColumns.length} className={styles.noData}>
                      No records found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}