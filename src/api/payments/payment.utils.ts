export function generateEmailTemplate(data: any) {
  const itinerariesHtml = data.itineraries
    .map(
      (flight: any, index: number) => `
      <tr>
  
      <td>${flight.DepartureAirportLocationCode} → ${
        flight.ArrivalAirportLocationCode
      }</td>
      <td>${flight.MarketingAirlineCode}</td>
      <td>${flight.DepartureDateTime} (Terminal ${
        flight.DepartureTerminal || "N/A"
      })</td>
      <td>${flight.ArrivalDateTime} (Terminal ${
        flight.ArrivalTerminal || "N/A"
      })</td>
        <td>${calculateDuration(
          flight.DepartureDateTime,
          flight.ArrivalDateTime
        )}</td>
      </tr>
    `
    )
    .join("");

  const passengerDetailsHtml = data?.passengerInfos
    .map(
      (passenger: any, index: number) => `
      <div style="margin-bottom: 20px; padding: 10px; border: 1px solid #ddd; border-radius: 4px;">
        <h3 style="color: #0056b3;">Passenger ${index + 1}</h3>
        <ul style="list-style-type: none; padding: 0;">
          <li><strong>Full Name:</strong>
          ${passenger.PaxName.PassengerTitle}
           ${passenger.PaxName.PassengerFirstName} ${
        passenger.PaxName.PassengerLastName
      }</li>
          <li><strong>Gender:</strong> ${
            passenger.Gender === "M" ? "Male" : "Female"
          }</li>
          <li><strong>Passenger Type:</strong> ${
            passenger.PassengerType === "ADT" ? "Adult" : "Child"
          }</li>
          <li><strong>Date of Birth:</strong> ${new Date(
            passenger.DateOfBirth
          ).toLocaleDateString()}</li>
          <li><strong>Passport Number:</strong> ${passenger.PassportNumber}</li>
        </ul>
      </div>
    `
    )
    .join("");

  return `
      <html>
      <head>
        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            margin: 0;
            padding: 0;
            background-color: #f4f4f9;
            color: #333;
          }
          .container {
              max-width: 650px; 
              margin: 10px auto; 
              background: #ffffff; 
              border: 1px solid #dddddd; 
              border-radius: 5px; 
              padding: 10px; 
              box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
          }
          h1, h2, h3 {
            color: #0056b3;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin: 10px 0;
          }
          table th, table td {
            border: 1px solid #ddd;
            padding: 5px;
            text-align: left;
          }
          table th {
            background: #0056b3;
            color: white;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>Booking Confirmation</h1>
          <p>Dear ${data.full_name},</p>
          <p>Your flight booking was successful. Below are the details:</p>
  
          <h3>Booking Details</h3>
          <ul>
            <li><strong>Order Number:</strong> ${data.orderNumber}</li>
            <li><strong>PNR:</strong> ${data.pnrId}</li>
            <li><strong>Payment Status:</strong> ${data.paymentStatus}</li>
            <li><strong>Booking Status:</strong> ${data.BookingStatus}</li>
            <li><strong>Created On:</strong> ${data.BookingCreatedOn}</li>
          </ul>
  
          <h3>Flight Itineraries</h3>
          <table>
            <thead>
              <tr>
                <th>Flight</th>
                <th>Airline</th>
                <th>Departure</th>
                <th>Arrival</th>
                <th>Duration</th>
              </tr>
            </thead>
            <tbody>
              ${itinerariesHtml}
            </tbody>
          </table>
  
  
          <div>
            <h3>Passenger Details</h3>
            ${passengerDetailsHtml}
          </div>
  
  
          <div style="text-align: center; margin-top: 10px;">
            <p style="font-size: 14px; color: #777;">
              Thank you for choosing our service. If you have any questions, contact us at
              <a href="mailto:flightkiya@gmail.com" style="color: #0073e6; text-decoration: none;">nazmulhosenm668@gmail.com</a>.
            </p>
          </div>
        </div>
      </body>
      </html>
    `;
}

export function calculateDuration(departure: string, arrival: string): string {
  const departureDate = new Date(departure);
  const arrivalDate = new Date(arrival);

  // Convert dates to milliseconds for arithmetic operations
  const differenceInMilliseconds =
    arrivalDate.getTime() - departureDate.getTime();

  // Convert milliseconds to hours and minutes
  const totalMinutes = Math.floor(differenceInMilliseconds / (1000 * 60));
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  return `${hours}h ${minutes}m`;
}
