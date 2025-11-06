"use client";
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import styles from "./styles.module.css";
import useDoctorStore from "@/store/useDoctorStore";
import {MultiSelectDropdown} from '@/app/doctor/MultiselectDropdown'

export default function DoctorTable() {
  const { data, columns, filters, setData, setColumns } = useDoctorStore();
  const [selectedColumns, setSelectedColumns] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/patients/`
        );
        const result = res.data;
        if (result?.data?.length) {
          setData(result.data);
          setColumns(Object.keys(result.data[0]));
          setSelectedColumns(Object.keys(result.data[0])); 
        }
      } catch (error) {
        console.error("Error fetching doctor data:", error);
      }
    };

    fetchData();
  }, [setData, setColumns]);

  const filteredData = data.filter((row) =>
    Object.entries(filters).every(([key, val]) => {
      if (!selectedColumns.includes(key)) return true;
      return val === ""
        ? true
        : String(row[key]).toLowerCase().includes(val.toLowerCase());
    })
  );

  return (
    <div className={styles.container}>
      <section className={styles.headerSection}>
        <h1>Doctor Dashboard</h1>
        <p>
          Manage patient data efficiently with real-time filters and a responsive layout.
        </p>
      </section>

      <section className={styles.filterSection}>
        <MultiSelectDropdown
          options={columns}
          selected={selectedColumns}
          onChange={setSelectedColumns}
          label="Select Columns to Display"
        />
      </section>

      <section className={styles.tableSection}>
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
              {filteredData.length > 0 ? (
                filteredData.map((row, i) => (
                  <tr key={i}>
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
      </section>
    </div>
  );
}