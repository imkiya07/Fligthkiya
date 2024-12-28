export function bookingRequestTemplate(booking: any, passengers: any[]) {
  return `
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Flight Booking Success - Flight Kiya</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f4f4f9;
            color: #333;
        }
        .container {
            max-width: 600px;
            margin: 10px auto;
            background: #fff;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            border-radius: 8px;
            overflow: hidden;
        }
        .header {
            background-color: #0a1c33;
            color: #fff;
            padding: 10px;
            text-align: center;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .header img {
            min-width: 60px;
            border-radius: 5px;
            margin-right: 10px;
        }
        .header h3{
          font-size: 28px;
          color: #faa719;
        }
        .content {
            padding: 10px;
        }
        .content h1 {
            text-align: center;
            color: #0a1c33;
        }
        .data-section {
            margin: 10px 0;
        }
        .data-section h2 {
            color: #faa719;
            border-bottom: 2px solid #0a1c33;
            padding-bottom: 5px;
        }
        .data-section p {
            margin: 5px 0;
        }
        .passenger-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 15px;
        }
        .passenger-table th, .passenger-table td {
            border: 1px solid #ddd;
            padding: 8px;
            text-align: left;
        }
        .passenger-table th {
            background-color: #0a1c33;
            color: #fff;
        }
        .footer {
            text-align: center;
            padding: 10px;
            background: #0a1c33;
            color: #fff;
        }
    </style>
</head>
<body>
    <div class="container">
            <div class="header">
                <img src="https://i.ibb.co.com/4d1QLr7/flightkiya.jpg" alt="Flight Kiya Logo">
                <h3>Flight Kiya</h3>
            </div>
            <div class="content">
                <h1>Flight Booking Request Successful</h1>
                <div class="data-section">
                    <h2>Booking Details</h2>
                    <p><strong>Order Number:</strong> ${
                      booking?.orderNumber
                    }</p>
                    <p><strong>Phone Number:</strong> ${booking?.CountryCode}-${
    booking?.AreaCode
  }-${booking?.PhoneNumber}</p>
                    <p><strong>Email:</strong> ${booking?.Email}</p>
                    <p><strong>Post Code:</strong> ${booking?.PostCode}</p>
                    <p><strong>Booking Status:</strong> ${
                      booking?.bookingStatus
                    }</p>
                </div>
                <div class="data-section">
                    <h2>Passengers</h2>
                    <table class="passenger-table">
                        <thead>
                            <tr>
                                <th>Type</th>
                                <th>Gender</th>
                                <th>Title</th>
                                <th>First Name</th>
                                <th>Last Name</th>
                                <th>Passport</th>
                                <th>DOB</th>
                                <th>Nationality</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${passengers
                              .map(
                                (passenger) => `
                            <tr>
                                <td>${passenger?.PassengerType}</td>
                                <td>${passenger?.Gender}</td>
                                <td>${passenger?.PassengerTitle}</td>
                                <td>${passenger?.PassengerFirstName}</td>
                                <td>${passenger?.PassengerLastName}</td>
                                <td>${passenger?.PassportNumber || "N/A"}</td>
                                <td>${passenger?.DateOfBirth}</td>
                                <td>${passenger?.PassengerNationality}</td>
                            </tr>`
                              )
                              .join("")}
                        </tbody>
                    </table>
                </div>
            </div>
            <div class="footer">
                Thank you for choosing Flight Kiya. Safe travels!
            </div>
        </div>
</body>
</html>`;
}
