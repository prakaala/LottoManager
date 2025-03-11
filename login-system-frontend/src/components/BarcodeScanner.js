// import axios from 'axios';
// import { Html5QrcodeScanner } from 'html5-qrcode';
// import React, { useEffect, useState } from 'react';
// import './BarcodeScanner.css';

// const BarcodeScanner = () => {
//     const [scannedCode, setScannedCode] = useState('');
//     const [scanner, setScanner] = useState(null);
//     const [manualCode, setManualCode] = useState('');
//     const [message, setMessage] = useState('');
//     const [error, setError] = useState('');
//     const [isLoading, setIsLoading] = useState(false);
//     const [tickets, setTickets] = useState([]);

//     useEffect(() => {
//         // Initialize scanner only if it hasn't been initialized
//         if (!scanner) {
//             const newScanner = new Html5QrcodeScanner('reader', {
//                 qrbox: {
//                     width: 250,
//                     height: 250,
//                 },
//                 fps: 5,
//                 rememberLastUsedCamera: true,
//                 showTorchButtonIfSupported: true,
//             }, false); // Set verbose to false to prevent default messages

//             newScanner.render(onScanSuccess, onScanError);
//             setScanner(newScanner);
//         }

//         // Cleanup function
//         return () => {
//             if (scanner) {
//                 scanner.clear();
//             }
//         };
//     }, [scanner]);

//     useEffect(() => {
//         fetchTickets();
//     }, []);

//     const onScanSuccess = async (decodedText) => {
//         setScannedCode(decodedText);
//         await saveBarcodeToDatabase(decodedText);
//     };

//     const onScanError = (error) => {
//         console.warn(error);
//     };

//     const saveBarcodeToDatabase = async (code) => {
//         try {
//             setIsLoading(true);
//             setError('');
//             setMessage('');
            
//             const token = localStorage.getItem('token');
//             if (!token) {
//                 setError('Not authenticated. Please log in again.');
//                 return;
//             }

//             // Format the current date
//             const now = new Date();
//             const formattedDate = now.toISOString().slice(0, 19).replace('T', ' ');

//             console.log('Sending barcode to server:', code);
            
//             const response = await axios.post(
//                 'http://localhost:5000/api/lottery/add',
//                 { 
//                     barcode: code,
//                     scannedAt: formattedDate
//                 },
//                 {
//                     headers: { 
//                         Authorization: `Bearer ${token}`,
//                         'Content-Type': 'application/json'
//                     }
//                 }
//             );

//             console.log('Server response:', response.data);

//             if (response.data.success) {
//                 setMessage(`Successfully saved barcode: ${code}`);
//                 setScannedCode('');
//                 setManualCode('');
//             } else {
//                 setError(response.data.message || 'Failed to save barcode');
//             }
//         } catch (error) {
//             console.error('Save barcode error:', {
//                 message: error.message,
//                 response: error.response?.data,
//                 status: error.response?.status
//             });
            
//             if (error.response?.data?.message) {
//                 setError(error.response.data.message);
//             } else if (error.message.includes('Network Error')) {
//                 setError('Network error. Please check your connection.');
//             } else {
//                 setError('Failed to save barcode. Please try again.');
//             }
//         } finally {
//             setIsLoading(false);
//         }
//     };

//     const handleManualSubmit = async (e) => {
//         e.preventDefault();
//         if (manualCode.trim()) {
//             await saveBarcodeToDatabase(manualCode.trim());
//         }
//     };

//     const fetchTickets = async () => {
//         try {
//             const token = localStorage.getItem('token');
//             const response = await axios.get(
//                 'http://localhost:5000/api/lottery/user',
//                 {
//                     headers: { Authorization: `Bearer ${token}` }
//                 }
//             );

//             if (response.data.success) {
//                 setTickets(response.data.tickets);
//             }
//         } catch (error) {
//             console.error('Error fetching tickets:', error);
//             setError('Failed to load tickets');
//         }
//     };

//     const handleDelete = async (ticketId) => {
//         if (!window.confirm('Are you sure you want to delete this ticket?')) {
//             return;
//         }

//         try {
//             const token = localStorage.getItem('token');
//             await axios.delete(
//                 `http://localhost:5000/api/lottery/${ticketId}`,
//                 {
//                     headers: { Authorization: `Bearer ${token}` }
//                 }
//             );
            
//             // Refresh tickets list
//             fetchTickets();
//             setMessage('Ticket deleted successfully');
//         } catch (error) {
//             console.error('Error deleting ticket:', error);
//             setError('Failed to delete ticket');
//         }
//     };

//     const downloadCSV = (tickets) => {
//         // Define CSV headers
//         const headers = ['ID', 'Barcode', 'Scan Date'];
        
//         // Convert tickets to CSV format
//         const csvData = tickets.map(ticket => [
//             ticket.id,
//             ticket.barcode,
//             new Date(ticket.scanned_at).toLocaleString()
//         ]);
        
//         // Combine headers and data
//         const csvContent = [
//             headers,
//             ...csvData
//         ].map(row => row.join(',')).join('\n');
        
//         // Create blob and download link
//         const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
//         const link = document.createElement('a');
//         const url = URL.createObjectURL(blob);
        
//         link.setAttribute('href', url);
//         link.setAttribute('download', `lottery_tickets_${new Date().toLocaleDateString()}.csv`);
//         link.style.visibility = 'hidden';
        
//         document.body.appendChild(link);
//         link.click();
//         document.body.removeChild(link);
//     };

//     return (
//         <div className="barcode-scanner-container">
//             <h2>Lottery Barcode Scanner</h2>
            
//             {/* Scanner Container */}
//             <div id="reader"></div>

//             {/* Manual Entry Form */}
//             <div className="Scan-It">
//                 <h3>Entry</h3>
//                 <form onSubmit={handleManualSubmit}>
//                     <input
//                         type="text"
//                         className="barcode-input"
//                         value={manualCode}
//                         onChange={(e) => setManualCode(e.target.value)}
//                         placeholder="Enter barcode "
//                     />
//                     <button 
//                         type="submit" 
//                         disabled={isLoading}
//                         className="submit-button"
//                     >
//                         {isLoading ? 'Saving...' : 'Save Barcode'}
//                     </button>
//                 </form>
//             </div>

//             {/* Messages */}
//             {message && <div className="success-message">{message}</div>}
//             {error && <div className="error-message">{error}</div>}
            
//             {/* Tickets Table */}
//             <div className="tickets-table-container">
//                 <div className="table-header">
//                     <h3>Scanned Tickets</h3>
//                     {tickets.length > 0 && (
//                         <button 
//                             onClick={() => downloadCSV(tickets)}
//                             className="download-csv-btn"
//                         >
//                             📥 Download CSV
//                         </button>
//                     )}
//                 </div>
//                 {tickets.length > 0 ? (
//                     <div className="table-responsive">
//                         <table className="tickets-table">
//                             <thead>
//                                 <tr>
//                                     <th>ID</th>
//                                     <th>Barcode</th>
//                                     <th>Scan Date</th>
//                                     <th>Actions</th>
                                    
//                                 </tr>
//                             </thead>
//                             <tbody>
//                                 {tickets.map(ticket => (
//                                     <tr key={ticket.id}>
//                                         <td>{ticket.id}</td>
//                                         <td className="barcode-cell">{ticket.barcode}</td>
//                                         <td>{new Date(ticket.scanned_at).toLocaleString()}</td>
//                                         <td>
//                                             <button 
//                                                 onClick={() => handleDelete(ticket.id)}
//                                                 className="delete-btn"
//                                                 title="Delete Ticket"
//                                             >
//                                                 🗑️
//                                             </button>
//                                         </td>
//                                     </tr>
//                                 ))}
//                             </tbody>
//                         </table>
//                     </div>
//                 ) : (
//                     <p>No tickets scanned yet</p>
//                 )}
//             </div>
//         </div>
//     );
// };

// export default BarcodeScanner; 




import axios from 'axios';
import { Html5QrcodeScanner } from 'html5-qrcode';
import React, { useEffect, useState } from 'react';
import './BarcodeScanner.css';

const BarcodeScanner = () => {
    const [scannedCode, setScannedCode] = useState('');
    const [scanner, setScanner] = useState(null);
    const [manualCode, setManualCode] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [tickets, setTickets] = useState([]);

    useEffect(() => {
        // Initialize scanner only if it hasn't been initialized
        if (!scanner) {
            const newScanner = new Html5QrcodeScanner('reader', {
                qrbox: {
                    width: 250,
                    height: 250,
                },
                fps: 5,
                rememberLastUsedCamera: true,
                showTorchButtonIfSupported: true,
            }, false); // Set verbose to false to prevent default messages

            newScanner.render(onScanSuccess, onScanError);
            setScanner(newScanner);
        }

        // Cleanup function
        return () => {
            if (scanner) {
                scanner.clear();
            }
        };
    }, [scanner]);

    useEffect(() => {
        fetchTickets();
    }, []);

    const onScanSuccess = async (decodedText) => {
        setScannedCode(decodedText);
        await saveBarcodeToDatabase(decodedText);
    };

    const onScanError = (error) => {
        console.warn(error);
    };

    const saveBarcodeToDatabase = async (code) => {
        try {
            setIsLoading(true);
            setError('');
            setMessage('');
            
            const token = localStorage.getItem('token');
            if (!token) {
                setError('Not authenticated. Please log in again.');
                return;
            }

            // Format the current date
            const now = new Date();
            const formattedDate = now.toISOString().slice(0, 19).replace('T', ' ');

            console.log('Sending barcode to server:', code);
            
            const response = await axios.post(
                'http://localhost:5000/api/lottery/add',
                { 
                    barcode: code,
                    scannedAt: formattedDate
                },
                {
                    headers: { 
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            console.log('Server response:', response.data);

            if (response.data.success) {
                setMessage(`Successfully saved barcode: ${code}`);
                setScannedCode('');
                setManualCode('');
                fetchTickets(); // Refresh tickets list after saving
            } else {
                setError(response.data.message || 'Failed to save barcode');
            }
        } catch (error) {
            console.error('Save barcode error:', {
                message: error.message,
                response: error.response?.data,
                status: error.response?.status
            });
            
            if (error.response?.data?.message) {
                setError(error.response.data.message);
            } else if (error.message.includes('Network Error')) {
                setError('Network error. Please check your connection.');
            } else {
                setError('Failed to save barcode. Please try again.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleManualSubmit = async (e) => {
        e.preventDefault();
        if (manualCode.trim()) {
            await saveBarcodeToDatabase(manualCode.trim());
        }
    };

    const fetchTickets = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(
                'http://localhost:5000/api/lottery/user',
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );

            if (response.data.success) {
                setTickets(response.data.tickets);
            }
        } catch (error) {
            console.error('Error fetching tickets:', error);
            setError('Failed to load tickets');
        }
    };

    const handleDelete = async (ticketId) => {
        if (!window.confirm('Are you sure you want to delete this ticket?')) {
            return;
        }

        try {
            const token = localStorage.getItem('token');
            await axios.delete(
                `http://localhost:5000/api/lottery/${ticketId}`,
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );
            
            // Refresh tickets list
            fetchTickets();
            setMessage('Ticket deleted successfully');
        } catch (error) {
            console.error('Error deleting ticket:', error);
            setError('Failed to delete ticket');
        }
    };

    const downloadCSV = (tickets) => {
        // Define CSV headers
        const headers = ['ID', 'Barcode', 'Scan Date'];
        
        // Convert tickets to CSV format
        const csvData = tickets.map(ticket => [
            ticket.id,
            ticket.barcode,
            new Date(ticket.scanned_at).toLocaleString()
        ]);
        
        // Combine headers and data
        const csvContent = [
            headers,
            ...csvData
        ].map(row => row.join(',')).join('\n');
        
        // Create blob and download link
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        
        link.setAttribute('href', url);
        link.setAttribute('download', `lottery_tickets_${new Date().toLocaleDateString()}.csv`);
        link.style.visibility = 'hidden';
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="barcode-scanner-container">
            <h2>Lottery Barcode Scanner</h2>
            
            {/* Scanner Container */}
            <div id="reader"></div>

            {/* Manual Entry Form */}
            <div className="Scan-It">
                <h3>Entry</h3>
                <form onSubmit={handleManualSubmit}>
                    <input
                        type="text"
                        className="barcode-input"
                        value={manualCode}
                        onChange={(e) => setManualCode(e.target.value)}
                        placeholder="Enter barcode "
                    />
                    <button 
                        type="submit" 
                        disabled={isLoading}
                        className="submit-button"
                    >
                        {isLoading ? 'Saving...' : 'Save Barcode'}
                    </button>
                </form>
            </div>

            {/* Messages */}
            {message && <div className="success-message">{message}</div>}
            {error && <div className="error-message">{error}</div>}
            
            {/* Tickets Table */}
            <div className="tickets-table-container">
                <div className="table-header">
                    <h3>Scanned Tickets</h3>
                    {tickets.length > 0 && (
                        <button 
                            onClick={() => downloadCSV(tickets)}
                            className="download-csv-btn"
                        >
                            📥 Download CSV
                        </button>
                    )}
                </div>
                {tickets.length > 0 ? (
                    <div className="table-responsive">
                        <table className="tickets-table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Barcode</th>
                                    <th>Scan Date</th>
                                    <th>Actions</th>
                                    
                                </tr>
                            </thead>
                            <tbody>
                                {tickets.map(ticket => (
                                    <tr key={ticket.id}>
                                        <td>{ticket.id}</td>
                                        <td className="barcode-cell">{ticket.barcode}</td>
                                        <td>{new Date(ticket.scanned_at).toLocaleString()}</td>
                                        <td>
                                            <button 
                                                onClick={() => handleDelete(ticket.id)}
                                                className="delete-btn"
                                                title="Delete Ticket"
                                            >
                                                🗑️
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <p>No tickets scanned yet</p>
                )}
            </div>
        </div>
    );
};

export default BarcodeScanner;