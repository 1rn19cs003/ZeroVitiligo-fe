
import { useState, useCallback } from 'react';
import toast from 'react-hot-toast';
import api from './axios.config';

export const useDatabaseExport = () => {
    const [status, setStatus] = useState('idle'); // idle, connecting, streaming, completed, error
    const [progress, setProgress] = useState('');

    const startExport = useCallback(() => {
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
                    accumulatedData[type] = data;
                }
            } catch (err) {
                console.error('Error parsing chunk:', err);
            }
        });

        eventSource.addEventListener('end', (e) => {
            try {
                const msg = JSON.parse(e.data).message;
                setProgress(msg);

                // Close connection
                eventSource.close();

                // Trigger download
                downloadFile(accumulatedData);

                setStatus('completed');
                toast.success(msg || 'Database export completed!');

                setTimeout(() => {
                    setStatus('idle');
                    setProgress('');
                }, 3000);
            } catch (err) {
                console.error(err);
                eventSource.close();
                setStatus('error');
            }
        });

        eventSource.addEventListener('error', (e) => {
            console.error('SSE Error:', e);

            // Try to parse error message if available
            let errorMessage = 'Connection failed.';
            if (e?.data) {
                try {
                    const errData = JSON.parse(e.data);
                    errorMessage = errData.message || errorMessage;
                } catch { }
            }

            toast.error(errorMessage);
            eventSource.close();
            setStatus('error');
        });

    }, []);

    const downloadFile = (data) => {
        try {
            const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            const date = new Date().toISOString().split('T')[0];
            link.setAttribute('download', `zerovitiligo_full_export_${date}.json`);
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
        } catch (err) {
            console.error('Download preparation failed:', err);
            toast.error('Failed to generate download file.');
        }
    }

    return {
        status,
        progress,
        startExport,
        isExporting: status === 'connecting' || status === 'streaming'
    };
};
