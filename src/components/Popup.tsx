import React, { useState } from 'react';
import JSZip from 'jszip';

const Popup: React.FC = () => {
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(event.target.files || []);
        setSelectedFiles(files);
    };

    const handleUpload = async () => {
        if (window.opener) {
            const zip = new JSZip();
            selectedFiles.forEach(file => zip.file(file.name, file));
            const zipBlob = await zip.generateAsync({ type: 'blob' });
            const zipFile = new File([zipBlob], 'files.zip');
            window.opener.postMessage({ files: [zipFile] }, window.location.origin);
            window.close();
        } else {
            console.error('No opener window found.');
        }
    };

    const handleDownload = async () => {
        const encrypt = async (data: ArrayBuffer) => {
            const key = await window.crypto.subtle.generateKey(
                { name: 'AES-GCM', length: 256 },
                true,
                ['encrypt']
            );
            const iv = window.crypto.getRandomValues(new Uint8Array(12));
            const encryptedData = await window.crypto.subtle.encrypt(
                { name: 'AES-GCM', iv },
                key,
                data
            );
            return { key, iv, encryptedData };
        };

        selectedFiles.forEach(async file => {
            const reader = new FileReader();
            reader.onload = async function (e) {
                if (e.target && e.target.result) {
                    const { encryptedData, iv } = await encrypt(e.target.result as ArrayBuffer);
                    const blob = new Blob([encryptedData]);
                    const url = URL.createObjectURL(blob);
                    chrome.runtime.sendMessage({ type: 'DOWNLOAD_FILE', url, filename: `${file.name}.encrypted`, iv });
                }
            };
            reader.readAsArrayBuffer(file);
        });
    };

    return (
        <div>
            <h1>Select Files</h1>
            <input type="file" multiple onChange={handleFileChange} />
            <button onClick={handleUpload}>Upload</button>
            <button onClick={handleDownload}>Download</button>
        </div>
    );
};

export default Popup;
