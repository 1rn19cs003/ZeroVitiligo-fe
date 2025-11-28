# DynamicTable Component

A highly flexible and reusable table component for React applications with support for custom rendering, sorting, pagination, and actions.

## Features

- ✅ **Dynamic Columns**: Define columns with custom configurations
- ✅ **Custom Rendering**: Support for React elements in cells
- ✅ **Sorting**: Built-in sorting for any column
- ✅ **Pagination**: Optional pagination with customizable page sizes
- ✅ **Actions**: Add action buttons to each row
- ✅ **Row Click**: Handle row click events
- ✅ **Loading State**: Built-in loader
- ✅ **Responsive**: Mobile-friendly design
- ✅ **Customizable**: Custom classes and styles

## Installation

The component is located at:
```
/components/DynamicTable/index.jsx
```

## Basic Usage

```jsx
import DynamicTable from "@/components/DynamicTable";

const columns = [
  { key: "id", label: "ID", sortable: true },
  { key: "name", label: "Name", sortable: true },
  { key: "email", label: "Email" },
];

<DynamicTable
  data={myData}
  columns={columns}
/>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `data` | Array | `[]` | Array of data objects to display |
| `columns` | Array | `[]` | Column configuration (see Column Config below) |
| `onRowClick` | Function | - | Callback when a row is clicked `(row, index) => {}` |
| `loading` | Boolean | `false` | Show loading state |
| `pagination` | Boolean | `true` | Enable/disable pagination |
| `defaultPageSize` | Number | `10` | Default number of records per page |
| `pageSizeOptions` | Array | `[5, 10, 20, 50]` | Options for page size dropdown |
| `emptyMessage` | String | `"No records found."` | Message when no data |
| `className` | String | `""` | Custom CSS class for container |
| `rowClassName` | String/Function | - | Custom class for rows (can be function) |
| `actions` | Array | `[]` | Action buttons configuration |

## Column Configuration

Each column object can have the following properties:

```javascript
{
  key: "fieldName",           // Required: field name in data object
  label: "Display Name",      // Required: column header text
  sortable: true,             // Optional: enable sorting
  render: (row, value) => {}, // Optional: custom render function
  width: "150px",             // Optional: column width
  align: "center",            // Optional: text alignment (left/center/right)
  className: "customClass",   // Optional: custom CSS class
}
```

### Custom Render Function

The `render` function receives two parameters:
- `row`: The entire row object
- `value`: The value of the current cell

```javascript
{
  key: "status",
  label: "Status",
  render: (row, value) => (
    <span className={`status-${value}`}>
      {value}
    </span>
  )
}
```

## Actions Configuration

Actions are buttons that appear in each row:

```javascript
const actions = [
  {
    label: "Edit",                    // Button text
    onClick: (row, index) => {},      // Click handler
    className: "editButton",          // Optional: custom class
    disabled: (row) => row.locked,    // Optional: disable condition
    icon: <EditIcon />                // Optional: icon element
  }
];
```

## Examples

### 1. Basic Table

```jsx
const columns = [
  { key: "id", label: "ID", sortable: true },
  { key: "name", label: "Name", sortable: true },
  { key: "email", label: "Email" },
];

<DynamicTable data={users} columns={columns} />
```

### 2. Table with Custom Rendering

```jsx
const columns = [
  {
    key: "name",
    label: "Name",
    render: (row, value) => (
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
        <img src={row.avatar} alt="" style={{ width: "32px", borderRadius: "50%" }} />
        <span>{value}</span>
      </div>
    )
  },
  {
    key: "status",
    label: "Status",
    render: (row, value) => (
      <span className={`badge badge-${value}`}>
        {value}
      </span>
    )
  }
];

<DynamicTable data={users} columns={columns} />
```

### 3. Table with Actions

```jsx
const actions = [
  {
    label: "Edit",
    onClick: (row) => handleEdit(row),
  },
  {
    label: "Delete",
    onClick: (row) => handleDelete(row),
    disabled: (row) => row.status === "ACTIVE",
  }
];

<DynamicTable
  data={users}
  columns={columns}
  actions={actions}
/>
```

### 4. Table with Row Click

```jsx
<DynamicTable
  data={patients}
  columns={columns}
  onRowClick={(row) => router.push(`/patient/${row.id}`)}
/>
```

### 5. Appointment Table with Status Chips

```jsx
const columns = [
  { key: "patientName", label: "Patient", sortable: true },
  {
    key: "appointmentDate",
    label: "Appointment",
    sortable: true,
    render: (row, date) => {
      const daysUntil = Math.ceil((new Date(date) - new Date()) / (1000 * 60 * 60 * 24));
      
      let chipStyle = {};
      let status = "";
      
      if (daysUntil < 0) {
        chipStyle = { backgroundColor: "#fee2e2", color: "#991b1b" };
        status = "Overdue";
      } else if (daysUntil <= 5) {
        chipStyle = { backgroundColor: "#fef3c7", color: "#92400e" };
        status = "Upcoming";
      } else {
        chipStyle = { backgroundColor: "#d1fae5", color: "#065f46" };
        status = "Scheduled";
      }
      
      return (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
          <span>{formatDate(date)}</span>
          <span style={{
            ...chipStyle,
            padding: "0.375rem 0.75rem",
            borderRadius: "9999px",
            fontSize: "0.75rem",
            fontWeight: "600",
            width: "fit-content"
          }}>
            {status}
          </span>
        </div>
      );
    }
  }
];

<DynamicTable data={appointments} columns={columns} />
```

### 6. Table without Pagination

```jsx
<DynamicTable
  data={settings}
  columns={columns}
  pagination={false}
/>
```

### 7. Table with Custom Row Styling

```jsx
const getRowClass = (row) => {
  if (row.status === "BLOCKED") return "row-blocked";
  if (row.priority === "HIGH") return "row-priority";
  return "";
};

<DynamicTable
  data={patients}
  columns={columns}
  rowClassName={getRowClass}
/>
```

## Styling

The component uses CSS modules. You can override styles by:

1. **Using className prop**:
```jsx
<DynamicTable className="my-custom-table" />
```

2. **Custom column classes**:
```javascript
{
  key: "status",
  label: "Status",
  className: "status-column"
}
```

3. **Custom action button classes**:
```javascript
{
  label: "Delete",
  className: "danger-button"
}
```

## Tips

1. **Performance**: For large datasets, consider using pagination
2. **Custom Rendering**: Use the `render` function for complex cell content
3. **Sorting**: Enable sorting on columns with comparable data types
4. **Actions**: Use `e.stopPropagation()` in action handlers to prevent row clicks
5. **Loading State**: Set `loading={true}` while fetching data

## See Also

- Check `examples.jsx` for more comprehensive examples
- The component uses the `Pagination` component from `/components/Pagination`
