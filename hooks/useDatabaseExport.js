
import { useState, useCallback, useRef } from 'react';
import toast from 'react-hot-toast';
import * as XLSX from 'xlsx';
import JSZip from 'jszip';

export const useDatabaseExport = () => {
    const [status, setStatus] = useState('idle'); // idle, connecting, streaming, completed, error
    const [progress, setProgress] = useState('');
    const formatRef = useRef('json');

    const startExport = useCallback((format = 'json') => {
        formatRef.current = format;
        setStatus('connecting');
        setProgress('Initializing connection...');
        const accumulatedData = {};

        // Prepare the SSE connection
        // We rely on standard browser cookie handling for authentication with credentials: 'include'.
        // If the backend requires an Authorization header, EventSource doesn't support it natively.
        // But since our axios config shows we rely on cookies (refreshToken flow), this should work 
        // as long as the cookie has been set by a previous login.

        const eventSource = new EventSource(`${process.env.NEXT_PUBLIC_SERVER_URL}/export/sse`, {
            withCredentials: true
        });

        eventSource.onopen = () => {
            setStatus('streaming');
            setProgress('Connected. Starting stream...');
        };

        eventSource.addEventListener('start', (e) => {
            try {
                const data = JSON.parse(e.data);
                setProgress(data.message);
            } catch (err) { console.error(err); }
        });

        eventSource.addEventListener('progress', (e) => {
            try {
                const data = JSON.parse(e.data);
                setProgress(data.message);
            } catch (err) { console.error(err); }
        });

        eventSource.addEventListener('data', (e) => {
            try {
                const payload = JSON.parse(e.data);
                const { type, data } = payload;

                if (type === 'metadata') {
                    accumulatedData.metadata = data;
                } else {
                    // Initialize array if not present, then concat
                    // This handles cases where data might come in multiple chunks for same type if backend was designed so
                    // But currently our backend fetches full table at once.
                    if (!accumulatedData[type]) accumulatedData[type] = [];
                    accumulatedData[type] = accumulatedData[type].concat(data);
                }
            } catch (err) {
                console.error('Error parsing chunk:', err);
            }
        });

        eventSource.addEventListener('end', async (e) => {
            try {
                const msg = JSON.parse(e.data).message;
                setProgress('Preparing download...');

                // Close connection
                eventSource.close();

                // Trigger download based on format
                await downloadFile(accumulatedData, formatRef.current);

                setStatus('completed');
                toast.success(msg || 'Database export completed!');

                setTimeout(() => {
                    setStatus('idle');
                    setProgress('');
                }, 3000);
            } catch (err) {
                console.error('Finalization error:', err);
                eventSource.close();
                setStatus('error');
                toast.error('Failed to finalize export.');
            }
        });

        eventSource.addEventListener('error', (e) => {
            console.error('SSE Error:', e);

            let errorMessage = 'Connection failed or session expired.';
            try {
                if (e?.data) {
                    const errData = JSON.parse(e.data);
                    errorMessage = errData.message || errorMessage;
                }
            } catch { }

            toast.error(errorMessage);
            eventSource.close();
            setStatus('error');
        });

    }, []);

    const flattenData = (data) => {
        // Simple flattener for nested objects to make them readable in Excel/CSV
        return data.map(item => {
            const newItem = {};
            Object.keys(item).forEach(key => {
                if (typeof item[key] === 'object' && item[key] !== null) {
                    newItem[key] = JSON.stringify(item[key]);
                } else {
                    newItem[key] = item[key];
                }
            });
            return newItem;
        });
    };

    const downloadFile = async (data, format) => {
        try {
            const date = new Date().toISOString().split('T')[0];
            const fileName = `zerovitiligo_db_export_${date}`;

            if (format === 'json') {
                const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
                saveBlob(blob, `${fileName}.json`);
            }
            else if (format === 'xlsx') {
                const workbook = XLSX.utils.book_new();
                Object.keys(data).forEach(tableName => {
                    if (tableName === 'metadata') return;
                    const flattened = flattenData(data[tableName]);
                    const worksheet = XLSX.utils.json_to_sheet(flattened);
                    XLSX.utils.book_append_sheet(workbook, worksheet, tableName);
                });
                const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
                const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
                saveBlob(blob, `${fileName}.xlsx`);
            }
            else if (format === 'csv') {
                const zip = new JSZip();
                Object.keys(data).forEach(tableName => {
                    if (tableName === 'metadata') return;
                    const flattened = flattenData(data[tableName]);
                    const worksheet = XLSX.utils.json_to_sheet(flattened);
                    const csvContent = XLSX.utils.sheet_to_csv(worksheet);
                    zip.file(`${tableName}.csv`, csvContent);
                });
                const content = await zip.generateAsync({ type: 'blob' });
                saveBlob(content, `${fileName}_csv_package.zip`);
            }
        } catch (err) {
            console.error('Download preparation failed:', err);
            throw err;
        }
    };

    const saveBlob = (blob, name) => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', name);
        document.body.appendChild(link);
        link.click();
        link.parentNode.removeChild(link);
        window.URL.revokeObjectURL(url);
    };

    return {
        status,
        progress,
        startExport,
        isExporting: status === 'connecting' || status === 'streaming'
    };
};
