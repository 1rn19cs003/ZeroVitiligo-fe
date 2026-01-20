"use client";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";

import styles from "./styles.module.css";
import { useDoctorStore, useUserStore } from "@/store/useStatesStore";
import { MultiSelectDropdown } from '@/app/doctor/MultiselectDropdown';
import { usePatients, useStatus } from '../../hooks/usePatients';
import Pagination from '../../components/Pagination';
import { formatDate } from "@/components/Miscellaneous";
import AssistantTable from './../../components/Assistant';
import { useIsAuthenticated } from "@/hooks/useAuth";
import { APPOINTMENT_STATUS, ROLES } from "@/lib/constants";

// Constants
const TAB_CONFIG = [
  { label: "All Patients", value: APPOINTMENT_STATUS.PATIENTS, sortCol: "createdAt", sortOrder: "desc" },
  { label: "Scheduled", value: APPOINTMENT_STATUS.SCHEDULED, sortCol: "appointmentDate", sortOrder: "asc" },
  { label: "Completed", value: APPOINTMENT_STATUS.COMPLETED, sortCol: "createdAt", sortOrder: "desc" },
];

const DEFAULT_STATUS_TABS = [
  { value: "SCHEDULED", label: "Scheduled" },
  { value: "NEW_REGISTRATION", label: "New Registration" },
  { value: "UNDER_TREATMENT", label: "Under Treatment" },
  { value: "PAUSE", label: "Pause" },
  { value: "FOLLOW_UP", label: "Follow Up" },
];

const SORTABLE_COLUMNS = ["createdAt", "appointmentDate", "updatedDate"];

// Helper Functions
const getNestedValue = (obj, path) => path.split('.').reduce((acc, part) => acc && acc[part], obj);

const getAppointmentStatus = (date) => {
  if (!date) return null;

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const apptDate = new Date(date);
  apptDate.setHours(0, 0, 0, 0);

  const diffDays = Math.ceil((apptDate - today) / (1000 * 60 * 60 * 24));

  if (diffDays < 0) return { text: 'Overdue', class: 'statusChipOverdue' };
  if (diffDays <= 5) return { text: 'Upcoming', class: 'statusChipUpcoming' };
  return { text: 'Scheduled', class: 'statusChipFuture' };
};

// Sub-components
function AppointmentDateCell({ date, status }) {
  if (!date) return <span>N/A</span>;

  // If appointment is completed, show completed status instead of date-based status
  if (status === APPOINTMENT_STATUS.COMPLETED) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', }}>
        <span>{formatDate(date)}</span>
        <span className={`${styles.statusChip} ${styles.statusChipCompleted}`}>
          Completed
        </span>
      </div>
    );
  }

  const appointmentStatus = getAppointmentStatus(date);
  if (!appointmentStatus) return <span>N/A</span>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
      <span>{formatDate(date)}</span>
      <span className={`${styles.statusChip} ${styles[appointmentStatus.class]}`}>
        {appointmentStatus.text}
      </span>
    </div>
  );
}

function ViewToggle({ showAssistants, setShowAssistants }) {
  return (
    <div className={styles.toggleSection}>
      <div className={styles.toggleContainer}>
        <button
          onClick={() => setShowAssistants(false)}
          disabled={!showAssistants}
          className={styles.toggleButton}
        >
          Doctor View
        </button>
        <button
          onClick={() => setShowAssistants(true)}
          disabled={showAssistants}
          className={styles.toggleButton}
        >
          Assistant View
        </button>
      </div>
    </div>
  );
}

function DashboardHeader({ onCreatePatient }) {
  return (
    <section className={styles.headerSection}>
      <div className={styles.headerContent}>
        <div>
          <h1>Doctor Dashboard</h1>
          <p>Manage patient data efficiently.</p>
        </div>
        <button onClick={onCreatePatient} className={styles.newPatientButton} type="button">
          + New Patient
        </button>
      </div>
    </section>
  );
}

function FilterSection({
  searchQuery,
  setSearchQuery,
  columns,
  selectedColumns,
  setSelectedColumns,
  activeTab,
  statusOptions,
  selectedStatuses,
  onStatusChange,
  statusLabelMap
}) {
  return (
    <section className={styles.filterSection}>
      <div className={styles.filterRow}>
        <div className={styles.searchContainer}>
          <label htmlFor="search" className={styles.searchLabel}>Search</label>
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

        {activeTab === APPOINTMENT_STATUS.PATIENTS && (
          <div className={styles.columnFilterContainer}>
            <MultiSelectDropdown
              options={statusOptions}
              selected={selectedStatuses}
              onChange={onStatusChange}
              label="Filter by Status"
              labelMap={statusLabelMap}
            />
          </div>
        )}
      </div>
    </section>
  );
}

function TableTabs({ activeTab, onTabChange }) {
  return (
    <section className={styles.tabsContainer}>
      {TAB_CONFIG.map((tab) => (
        <button
          key={tab.value}
          className={`${styles.tab} ${activeTab === tab.value ? styles.activeTab : ""}`}
          onClick={() => onTabChange(tab)}
        >
          {tab.label}
        </button>
      ))}
    </section>
  );
}

// Custom Hooks
function useTransformedData(data, activeTab) {
  return useMemo(() => {
    if (!data || data.length === 0) return [];

    return data.map(row => {
      let relevantAppointment = null;

      if (activeTab === APPOINTMENT_STATUS.SCHEDULED) {
        relevantAppointment = row.appointmentData?.find(appt => appt.status === APPOINTMENT_STATUS.SCHEDULED);
      }
      else if (activeTab === APPOINTMENT_STATUS.COMPLETED) {
        const hasScheduled = row.appointmentData?.some(appt => appt.status === APPOINTMENT_STATUS.SCHEDULED);
        if (!hasScheduled) {
          // Get all completed appointments and sort by date (latest first)
          const completedAppointments = row.appointmentData?.filter(appt => appt.status === APPOINTMENT_STATUS.COMPLETED);
          if (completedAppointments && completedAppointments.length > 0) {
            relevantAppointment = [...completedAppointments].sort((a, b) =>
              new Date(b.appointmentDate) - new Date(a.appointmentDate)
            )[0];
          }
        }
      }
      else if (activeTab === APPOINTMENT_STATUS.PATIENTS) {
        const scheduled = row.appointmentData?.find(appt => appt.status === APPOINTMENT_STATUS.SCHEDULED);
        if (scheduled) {
          relevantAppointment = scheduled;
        } else if (row.appointmentData?.length > 0) {
          relevantAppointment = [...row.appointmentData].sort((a, b) =>
            new Date(b.appointmentDate) - new Date(a.appointmentDate)
          )[0];
        }
      }
      console.log({ relevantAppointment })

      return {
        ...row,
        appointmentDate: relevantAppointment?.appointmentDate || null,
        updatedDate: relevantAppointment?.updatedAt || null,
        appointmentStatus: relevantAppointment?.status || null,
      };
    });
  }, [data, activeTab]);
}

function useDerivedColumns(transformedData, activeTab) {
  return useMemo(() => {
    if (!transformedData.length) return [];

    const allKeys = new Set();
    transformedData.forEach(row => Object.keys(row).forEach(key => allKeys.add(key)));

    // For appointment tabs (Scheduled/Completed), hide createdAt and show appointmentDate
    // For All Patients tab, show createdAt and hide appointmentDate
    const excludeCols = activeTab === APPOINTMENT_STATUS.SCHEDULED || activeTab === APPOINTMENT_STATUS.COMPLETED
      ? ['createdAt', 'appointmentData', 'appointmentStatus']
      : ['appointmentData', 'appointmentStatus', 'updatedDate'];

    let baseColumns = Array.from(allKeys).filter(key => !excludeCols.includes(key));

    // Only exclude appointmentDate for All Patients tab
    if (activeTab === APPOINTMENT_STATUS.PATIENTS) {
      baseColumns = baseColumns.filter(key => key !== 'appointmentDate');
    }

    return baseColumns;
  }, [transformedData, activeTab]);
}

function useFilteredData(transformedData, filters, searchQuery, selectedColumns, selectedStatuses, activeTab) {
  return useMemo(() => {
    const getFieldValue = (row, key) => key.includes('.') ? getNestedValue(row, key) : row[key];

    const matchesTabFilter = (row) => {
      const isAppointmentTab = activeTab === APPOINTMENT_STATUS.SCHEDULED || activeTab === APPOINTMENT_STATUS.COMPLETED;
      if (isAppointmentTab) return !!row.appointmentDate;
      if (selectedStatuses.length === 0) return true;
      return selectedStatuses.includes(row.status);
    };

    const matchesColumnFilters = (row) => {
      return Object.entries(filters).every(([key, val]) => {
        if (!selectedColumns.includes(key) || val === "") return true;
        const fieldVal = getFieldValue(row, key);
        return String(fieldVal ?? '').toLowerCase().includes(val.toLowerCase());
      });
    };

    const matchesSearchQuery = (row) => {
      if (searchQuery === "") return true;
      return selectedColumns.some(col => {
        const fieldVal = getFieldValue(row, col);
        return String(fieldVal ?? '').toLowerCase().includes(searchQuery.toLowerCase());
      });
    };

    return transformedData.filter((row) =>
      matchesTabFilter(row) && matchesColumnFilters(row) && matchesSearchQuery(row)
    );
  }, [transformedData, filters, searchQuery, selectedColumns, selectedStatuses, activeTab]);
}

function useSortedData(filteredData, sortColumn, sortOrder) {
  return useMemo(() => {
    if (!sortOrder || !sortColumn) return filteredData;

    return [...filteredData].sort((a, b) => {
      const valA = a[sortColumn];
      const valB = b[sortColumn];

      if (!valA && !valB) return 0;
      if (!valA) return 1;
      if (!valB) return -1;

      const dateA = new Date(valA);
      const dateB = new Date(valB);
      return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
    });
  }, [filteredData, sortColumn, sortOrder]);
}

function usePagination(sortedData, currentPage, recordsPerPage) {
  return useMemo(() => {
    const totalRecords = sortedData.length;
    const totalPages = Math.ceil(totalRecords / recordsPerPage);
    const indexOfLastRecord = currentPage * recordsPerPage;
    const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
    const currentRecords = sortedData.slice(indexOfFirstRecord, indexOfLastRecord);

    return { currentRecords, totalRecords, totalPages };
  }, [sortedData, currentPage, recordsPerPage]);
}

// Main Component
export default function DoctorTable() {
  const router = useRouter();
  const isAuthenticated = useIsAuthenticated();
  const { data: userInfo } = useUserStore();
  const { data: rawData = [], isLoading } = usePatients();
  const { data: statusData = [] } = useStatus();
  const { columns, filters, setData, setColumns } = useDoctorStore();

  // State
  const [showAssistants, setShowAssistants] = useState(false);
  const [activeTab, setActiveTab] = useState(APPOINTMENT_STATUS.SCHEDULED);
  const [selectedColumns, setSelectedColumns] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortColumn, setSortColumn] = useState('appointmentDate');
  const [sortOrder, setSortOrder] = useState('asc');
  const [selectedStatuses, setSelectedStatuses] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage, setRecordsPerPage] = useState(10);

  // Auth check
  useEffect(() => {
    if (!isAuthenticated()) {
      router.push(`${process.env.NEXT_PUBLIC_SERVER_URL}/login`);
    }
  }, [router, isAuthenticated]);

  // Status options
  const { statusOptions, statusLabelMap } = useMemo(() => {
    const options = statusData && statusData.length > 0
      ? statusData.map(s => ({
        value: s.value || s.name || s,
        label: s.label || s.displayName || s.name || s
      }))
      : DEFAULT_STATUS_TABS;

    const map = options.reduce((acc, curr) => ({ ...acc, [curr.value]: curr.label }), {});
    return { statusOptions: options.map(o => o.value), statusLabelMap: map };
  }, [statusData]);

  // Data transformation and filtering
  const transformedData = useTransformedData(rawData, activeTab);
  const derivedColumns = useDerivedColumns(transformedData, activeTab);
  const filteredData = useFilteredData(transformedData, filters, searchQuery, selectedColumns, selectedStatuses, activeTab);
  const sortedData = useSortedData(filteredData, sortColumn, sortOrder);
  const { currentRecords, totalRecords, totalPages } = usePagination(sortedData, currentPage, recordsPerPage);

  // Update columns when data changes
  useEffect(() => {
    if (transformedData.length > 0) {
      setData(transformedData);
      setColumns(derivedColumns);
      setSelectedColumns(derivedColumns);
    }
  }, [transformedData, derivedColumns, setData, setColumns]);

  // Handlers
  const handleTabChange = useCallback((tab) => {
    setActiveTab(tab.value);
    setCurrentPage(1);
    setSortColumn(tab.sortCol);
    setSortOrder(tab.sortOrder);
  }, []);

  const handleStatusChange = useCallback((newStatuses) => {
    setSelectedStatuses(newStatuses);
    setCurrentPage(1);
  }, []);

  const handlePageChange = useCallback((page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  }, [totalPages]);

  const handleRecordsPerPageChange = useCallback((e) => {
    setRecordsPerPage(Number(e.target.value));
    setCurrentPage(1);
  }, []);

  const handleRowClick = useCallback((patient) => {
    router.push(`/doctor/patient/${patient.id}`);
  }, [router]);

  const handleCreatePatient = useCallback(() => {
    router.push('/register');
  }, [router]);

  const toggleSort = useCallback((col) => {
    if (sortColumn === col) {
      setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(col);
      setSortOrder('asc');
    }
  }, [sortColumn]);

  const renderCellContent = useCallback((row, col) => {
    if (col === 'appointmentDate') return <AppointmentDateCell date={row[col]} status={row.appointmentStatus} />;
    if (col === "createdAt") return formatDate(row[col]);
    if (col === "updatedDate") return formatDate(row[col]);
    if (col.includes('.')) return getNestedValue(row, col);
    return row[col];
  }, []);

  // Render
  return (
    <div className={styles.container}>
      {userInfo.role === ROLES.ADMIN && (
        <ViewToggle showAssistants={showAssistants} setShowAssistants={setShowAssistants} />
      )}

      {showAssistants ? (
        <AssistantTable />
      ) : (
        <>
          <DashboardHeader onCreatePatient={handleCreatePatient} />

          <FilterSection
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            columns={columns}
            selectedColumns={selectedColumns}
            setSelectedColumns={setSelectedColumns}
            activeTab={activeTab}
            statusOptions={statusOptions}
            selectedStatuses={selectedStatuses}
            onStatusChange={handleStatusChange}
            statusLabelMap={statusLabelMap}
          />

          <section className={styles.tableSection}>
            <TableTabs activeTab={activeTab} onTabChange={handleTabChange} />

            {isLoading ? (
              <div className={styles.loaderContainer}>
                <div className={styles.loader}></div>
                <p className={styles.loaderText}>Loading patient data...</p>
              </div>
            ) : (
              <>
                <div className={styles.tableWrapper}>
                  <table className={styles.table}>
                    <thead>
                      <tr>
                        {selectedColumns.map((col, index) => (
                          SORTABLE_COLUMNS.includes(col) ? (
                            <th
                              key={`${col}+${index}`}
                              onClick={() => toggleSort(col)}
                              style={{ cursor: "pointer", userSelect: "none" }}
                              title={`Sort by ${col}`}
                            >
                              {col} {sortColumn === col ? (sortOrder === "asc" ? "↑" : "↓") : '↓↑'}
                            </th>
                          ) : (
                            <th key={`${col}+${index}`}>{col}</th>
                          )
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {currentRecords.length > 0 ? (
                        currentRecords.map((row, index) => (
                          <tr
                            key={row.id || index}
                            onClick={() => handleRowClick(row)}
                            className={styles.clickableRow}
                          >
                            {selectedColumns.map(col => (
                              <td key={col}>{renderCellContent(row, col)}</td>
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

                {totalRecords > 0 && (
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    totalRecords={totalRecords}
                    recordsPerPage={recordsPerPage}
                    onPageChange={handlePageChange}
                    onRecordsPerPageChange={handleRecordsPerPageChange}
                    showPageNumbers={true}
                    showJumpToFirst={true}
                    showJumpToLast={true}
                    maxPageButtons={3}
                  />
                )}
              </>
            )}
          </section>
        </>
      )}
    </div>
  );
}