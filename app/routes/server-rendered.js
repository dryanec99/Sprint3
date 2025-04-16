// server-rendered.js
const express = require('express');
const router = express.Router();
const db = require('../services/db');

// Server-side rendered reservations page
router.get('/reservations', async (req, res) => {
    try {
        // Fetch all reservations with detailed information
        const query = `
            SELECT r.reservationID, r.recipientID, r.foodID, r.status, r.pickupDate, 
                   r.created_at as reservationDate, 
                   u.name as recipientName,
                   COALESCE(f.name, 'Unknown Item') as foodName, 
                   COALESCE(f.quantity, 1) as quantity, 
                   COALESCE(fr.location, 'Not specified') as location, 
                   COALESCE(f.expirationDate, 'Not specified') as expirationDate
            FROM reservations r
            LEFT JOIN food_items f ON r.foodID = f.foodID
            LEFT JOIN fridges fr ON f.fridgeID = fr.fridgeID
            LEFT JOIN users u ON r.recipientID = u.userID
            ORDER BY r.created_at DESC
        `;
        
        const results = await db.query(query);
        console.log(`Found ${results.length} reservations for server-rendered page`);
        
        // Count statistics
        let pendingCount = 0;
        let approvedCount = 0;
        let cancelledCount = 0;
        
        results.forEach(reservation => {
            const status = reservation.status || 'Pending';
            if (status === 'Pending') pendingCount++;
            else if (status === 'Confirmed' || status === 'Approved') approvedCount++;
            else if (status === 'Cancelled') cancelledCount++;
        });
        
        // Generate HTML for the reservations table
        let tableRows = '';
        
        results.forEach(reservation => {
            // Format dates
            const reservationDate = reservation.reservationDate 
                ? new Date(reservation.reservationDate).toLocaleDateString() 
                : 'N/A';
            
            const pickupDate = reservation.pickupDate 
                ? new Date(reservation.pickupDate).toLocaleDateString() 
                : 'N/A';
            
            // Determine status class
            let statusClass = 'status-pending';
            if (reservation.status === 'Confirmed' || reservation.status === 'Approved') {
                statusClass = 'status-approved';
            } else if (reservation.status === 'Cancelled') {
                statusClass = 'status-cancelled';
            }
            
            // Generate table row
            tableRows += `
                <tr class="${statusClass}">
                    <td>${reservation.reservationID || 'N/A'}</td>
                    <td>${reservationDate}</td>
                    <td>${reservation.recipientName || 'Unknown'}</td>
                    <td>${reservation.foodName || 'Unknown'} (${reservation.quantity || 1})</td>
                    <td>${pickupDate}</td>
                    <td>${reservation.location || 'N/A'}</td>
                    <td>${reservation.status || 'Pending'}</td>
                </tr>
            `;
        });
        
        // Render the complete HTML page
        const html = `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Server-Rendered Reservations</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        margin: 20px;
                        line-height: 1.6;
                    }
                    h1, h2 {
                        color: #2e8b57;
                    }
                    .stats-container {
                        display: flex;
                        justify-content: space-between;
                        margin-bottom: 20px;
                    }
                    .stat-card {
                        background-color: #f5f5f5;
                        padding: 15px;
                        border-radius: 5px;
                        text-align: center;
                        flex: 1;
                        margin-right: 10px;
                    }
                    .stat-card:last-child {
                        margin-right: 0;
                    }
                    .stat-value {
                        font-size: 24px;
                        font-weight: bold;
                        margin-bottom: 5px;
                    }
                    table {
                        width: 100%;
                        border-collapse: collapse;
                        margin-top: 20px;
                    }
                    th, td {
                        border: 1px solid #ddd;
                        padding: 8px;
                        text-align: left;
                    }
                    th {
                        background-color: #f2f2f2;
                    }
                    .status-pending {
                        background-color: #fff3cd;
                    }
                    .status-approved {
                        background-color: #d4edda;
                    }
                    .status-cancelled {
                        background-color: #f8d7da;
                    }
                </style>
            </head>
            <body>
                <h1>Server-Rendered Reservations</h1>
                <p>This page is rendered directly on the server with no JavaScript required.</p>
                
                <div class="stats-container">
                    <div class="stat-card">
                        <div class="stat-value">${pendingCount}</div>
                        <div class="stat-label">Pending</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-value">${approvedCount}</div>
                        <div class="stat-label">Approved</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-value">${cancelledCount}</div>
                        <div class="stat-label">Cancelled</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-value">${results.length}</div>
                        <div class="stat-label">Total</div>
                    </div>
                </div>
                
                <h2>All Reservations (${results.length})</h2>
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Date</th>
                            <th>Recipient</th>
                            <th>Food Item</th>
                            <th>Pickup Date</th>
                            <th>Location</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${tableRows}
                    </tbody>
                </table>
                
                <script>
                    // No JavaScript required for this page!
                    console.log('Server-rendered page loaded successfully');
                </script>
            </body>
            </html>
        `;
        
        // Send the HTML response
        res.send(html);
        
    } catch (error) {
        console.error('Error rendering reservations page:', error);
        res.status(500).send(`
            <html>
                <head><title>Error</title></head>
                <body>
                    <h1>Error</h1>
                    <p>Failed to render reservations page: ${error.message}</p>
                </body>
            </html>
        `);
    }
});

module.exports = router;
