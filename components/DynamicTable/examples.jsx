/**
 * DynamicTable Usage Examples
 * 
 * This file demonstrates various ways to use the DynamicTable component
 */

import DynamicTable from "@/components/DynamicTable";
import { formatDate } from "@/components/Miscellaneous";

// ============================================
// EXAMPLE 1: Basic Usage
// ============================================
export function BasicTableExample({ patients }) {
    const columns = [
        {
            key: "id",
            label: "Patient ID",
            sortable: true,
        },
        {
            key: "name",
            label: "Name",
            sortable: true,
        },
        {
            key: "age",
            label: "Age",
            sortable: true,
            align: "center",
        },
        {
            key: "mobile",
            label: "Mobile",
        },
    ];

    return (
        <DynamicTable
            data={patients}
            columns={columns}
            onRowClick={(row) => console.log("Clicked:", row)}
        />
    );
}

// ============================================
// EXAMPLE 2: Custom Rendering with React Elements
// ============================================
export function CustomRenderExample({ patients }) {
    const columns = [
        {
            key: "name",
            label: "Patient Name",
            sortable: true,
            render: (row, value) => (
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <div
                        style={{
                            width: "32px",
                            height: "32px",
                            borderRadius: "50%",
                            backgroundColor: "#dbeafe",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontWeight: "600",
                            color: "#1e40af",
                        }}
                    >
                        {value?.charAt(0).toUpperCase()}
                    </div>
                    <span>{value}</span>
                </div>
            ),
        },
        {
            key: "status",
            label: "Status",
            render: (row, value) => {
                const statusColors = {
                    NEW_REGISTRATION: { bg: "#dbeafe", color: "#1e40af" },
                    UNDER_TREATMENT: { bg: "#d1fae5", color: "#065f46" },
                    PAUSE: { bg: "#fef3c7", color: "#92400e" },
                    BLOCKED: { bg: "#fee2e2", color: "#991b1b" },
                };
                const style = statusColors[value] || { bg: "#f3f4f6", color: "#374151" };

                return (
                    <span
                        style={{
                            padding: "0.25rem 0.75rem",
                            borderRadius: "9999px",
                            fontSize: "0.75rem",
                            fontWeight: "600",
                            backgroundColor: style.bg,
                            color: style.color,
                        }}
                    >
                        {value?.replace(/_/g, " ")}
                    </span>
                );
            },
        },
        {
            key: "createdAt",
            label: "Registration Date",
            sortable: true,
            render: (row, value) => formatDate(value),
        },
    ];

    return <DynamicTable data={patients} columns={columns} />;
}

// ============================================
// EXAMPLE 3: With Actions
// ============================================
export function TableWithActionsExample({ patients, onEdit, onDelete }) {
    const columns = [
        { key: "id", label: "ID", sortable: true },
        { key: "name", label: "Name", sortable: true },
        { key: "mobile", label: "Mobile" },
    ];

    const actions = [
        {
            label: "Edit",
            onClick: (row) => onEdit(row),
            className: "editButton",
        },
        {
            label: "Delete",
            onClick: (row) => onDelete(row),
            className: "deleteButton",
            disabled: (row) => row.status === "UNDER_TREATMENT", // Disable delete for patients under treatment
        },
    ];

    return (
        <DynamicTable
            data={patients}
            columns={columns}
            actions={actions}
            onRowClick={(row) => console.log("Row clicked:", row)}
        />
    );
}

// ============================================
// EXAMPLE 4: Appointment Date with Status Chips
// ============================================
export function AppointmentTableExample({ appointments }) {
    const renderAppointmentDate = (row, appointmentDate) => {
        if (!appointmentDate) return "N/A";

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const apptDate = new Date(appointmentDate);
        apptDate.setHours(0, 0, 0, 0);

        const diffTime = apptDate - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        let chipStyle = {};
        let statusText = "";

        if (diffDays < 0) {
            chipStyle = { backgroundColor: "#fee2e2", color: "#cc4949ff" };
            statusText = "Overdue";
        } else if (diffDays <= 5) {
            chipStyle = { backgroundColor: "#fef3c7", color: "#cd7d4bff" };
            statusText = "Upcoming";
        } else {
            chipStyle = { backgroundColor: "#d1fae5", color: "#065f46ff" };
            statusText = "Scheduled";
        }

        return (
            <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
                <span>{formatDate(appointmentDate)}</span>
                <span
                    style={{
                        ...chipStyle,
                        padding: "0.375rem 0.75rem",
                        borderRadius: "9999px",
                        fontSize: "0.75rem",
                        fontWeight: "600",
                        display: "inline-block",
                        width: "fit-content",
                    }}
                >
                    {statusText}
                </span>
            </div>
        );
    };

    const columns = [
        { key: "patientName", label: "Patient", sortable: true },
        { key: "doctorName", label: "Doctor", sortable: true },
        {
            key: "appointmentDate",
            label: "Appointment Date",
            sortable: true,
            render: renderAppointmentDate,
        },
        { key: "reason", label: "Reason" },
    ];

    return <DynamicTable data={appointments} columns={columns} />;
}

// ============================================
// EXAMPLE 5: Without Pagination
// ============================================
export function NoPaginationExample({ data }) {
    const columns = [
        { key: "name", label: "Name" },
        { key: "value", label: "Value" },
    ];

    return (
        <DynamicTable
            data={data}
            columns={columns}
            pagination={false}
            emptyMessage="No data available"
        />
    );
}

// ============================================
// EXAMPLE 6: Custom Row Styling
// ============================================
export function CustomRowStylingExample({ patients }) {
    const columns = [
        { key: "name", label: "Name" },
        { key: "status", label: "Status" },
    ];

    const getRowClassName = (row) => {
        if (row.status === "BLOCKED") return "blockedRow";
        if (row.status === "UNDER_TREATMENT") return "activeTreatmentRow";
        return "";
    };

    return (
        <DynamicTable
            data={patients}
            columns={columns}
            rowClassName={getRowClassName}
        />
    );
}

// ============================================
// EXAMPLE 7: Complete Example for Doctor Dashboard
// ============================================
export function DoctorDashboardTable({ patients, onPatientClick, onDeletePatient, userRole }) {
    const renderAppointmentDate = (row, appointmentDate) => {
        if (!appointmentDate) return "N/A";

        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const apptDate = new Date(appointmentDate);
        apptDate.setHours(0, 0, 0, 0);
        const diffDays = Math.ceil((apptDate - today) / (1000 * 60 * 60 * 24));

        let chipStyle = {};
        let statusText = "";

        if (diffDays < 0) {
            chipStyle = { backgroundColor: "#fee2e2", color: "#cc4949ff" };
            statusText = "Overdue";
        } else if (diffDays <= 5) {
            chipStyle = { backgroundColor: "#fef3c7", color: "#cd7d4bff" };
            statusText = "Upcoming";
        } else {
            chipStyle = { backgroundColor: "#d1fae5", color: "#065f46ff" };
            statusText = "Scheduled";
        }

        return (
            <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
                <span>{formatDate(appointmentDate)}</span>
                <span
                    style={{
                        ...chipStyle,
                        padding: "0.375rem 0.75rem",
                        borderRadius: "9999px",
                        fontSize: "0.75rem",
                        fontWeight: "600",
                        display: "inline-block",
                        width: "fit-content",
                    }}
                >
                    {statusText}
                </span>
            </div>
        );
    };

    const columns = [
        { key: "id", label: "Patient ID", sortable: true },
        { key: "name", label: "Name", sortable: true },
        { key: "age", label: "Age", sortable: true, align: "center" },
        { key: "mobile", label: "Mobile" },
        { key: "address", label: "Address" },
        { key: "state", label: "State" },
        {
            key: "status",
            label: "Status",
            render: (row, value) => (
                <span style={{ textTransform: "capitalize" }}>
                    {value?.replace(/_/g, " ")}
                </span>
            ),
        },
        {
            key: "appointmentDate",
            label: "Appointment Date",
            sortable: true,
            render: renderAppointmentDate,
        },
    ];

    const actions = userRole === "ADMIN" ? [
        {
            label: "Delete",
            onClick: (row) => onDeletePatient(row.id),
            className: "deleteButton",
        },
    ] : [];

    return (
        <DynamicTable
            data={patients}
            columns={columns}
            actions={actions}
            onRowClick={onPatientClick}
            defaultPageSize={10}
            pageSizeOptions={[10, 20, 50, 100]}
        />
    );
}
