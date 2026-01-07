'use client';

import { useState } from 'react';
import { Download, Activity } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../hooks/axios.config';
import styles from './styles.module.css';

export default function DatabaseExport() {
    const [loading, setLoading] = useState(false);
    const [sseLoading, setSseLoading] = useState(false);
    const [progress, setProgress] = useState('');

    const handleExport = async () => {
        try {
            setLoading(true);

            const response = await api.get(`${process.env.NEXT_PUBLIC_SERVER_URL}/export/all`);

            const data = response.data;

            downloadFile(data, 'json');

            toast.success('Database exported successfully!');
        } catch (error) {
            console.error('Export failed:', error);
            toast.error(error?.response?.data?.message || 'Failed to export database.');
        } finally {
            setLoading(false);
        }
    };

    const handleSSEExport = async () => {
        setSseLoading(true);
        setProgress('Connecting...');
        const accumulatedData = {};

        // We need to pass credentials (cookies) to EventSource. 
        // Native EventSource doesn't support custom headers but supports withCredentials.
        // However, if the backend validates strictly via Authorization header, this might fail unless successful cookie auth is inplace.
        // Assuming cookie auth is working (since standard API calls work).

        const eventSource = new EventSource(`${process.env.NEXT_PUBLIC_SERVER_URL}/export/sse`, { withCredentials: true });

        eventSource.onopen = () => {
            setProgress('Starting stream...');
        };

        eventSource.addEventListener('start', (e) => {
            const data = JSON.parse(e.data);
            console.log('SSE Start:', data);
            setProgress(data.message);
        });

        eventSource.addEventListener('progress', (e) => {
            const data = JSON.parse(e.data);
            setProgress(data.message);
        });

        eventSource.addEventListener('data', (e) => {
            const payload = JSON.parse(e.data);
            const { type, data } = payload;
            if (type === 'metadata') {
                accumulatedData.metadata = data;
            } else {
                accumulatedData[type] = data;
            }
        });

        eventSource.addEventListener('end', (e) => {
            setProgress('Completed!');
            eventSource.close();
            downloadFile(accumulatedData, 'sse-json');
            setSseLoading(false);
            setProgress('');
            toast.success('Streamed export completed!');
        });

        eventSource.onerror = (e) => {
            console.error('SSE Error:', e);
            eventSource.close();
            setSseLoading(false);
            setProgress('');
            toast.error('Stream failed. Check console.');
        };
    };

    const downloadFile = (data, suffix) => {
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        const date = new Date().toISOString().split('T')[0];
        link.setAttribute('download', `zerovitiligo_db_export_${suffix}_${date}.json`);
        document.body.appendChild(link);
        link.click();
        link.parentNode.removeChild(link);
    }

    return (
        <div className={styles.container}>
            <div className={styles.buttonGroup}>
                <button
                    onClick={handleExport}
                    disabled={loading || sseLoading}
                    className={styles.exportButton}
                    title="Export full database as JSON (Standard)"
                >
                    <Download size={20} />
                    {loading ? 'Exporting...' : 'Export All Data'}
                </button>

                <button
                    onClick={handleSSEExport}
                    disabled={loading || sseLoading}
                    className={`${styles.exportButton} ${styles.sseButton}`}
                    title="Export full database via Server-Sent Events (Streams data)"
                >
                    <Activity size={20} />
                    {sseLoading ? progress || 'Streaming...' : 'Stream Export (SSE)'}
                </button>
            </div>
        </div>
    );
}
