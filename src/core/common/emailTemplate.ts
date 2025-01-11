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
            max-width: 80px;
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
                    <p><strong>Phone Number:</strong> ${
                      booking?.PhoneNumber
                    }</p>
                    <p><strong>Email:</strong> ${booking?.Email}</p>
                    <p><strong>Booking Status:</strong> ${
                      booking?.ticketStatus
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

export const resetPassTemplate = (
  name: string,
  code: string,
  baseUrl: string
) => {
  return `
    
    <!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Reset Password</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #f4f4f4;
      margin: 0;
      padding: 0;
    }
    .email-container {
      max-width: 600px;
      margin: 20px auto;
      background: #ffffff;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    }
    .email-header {
      background-color: #4CAF50;
      color: #ffffff;
      text-align: center;
      padding: 20px 10px;
      font-size: 24px;
    }
    .email-body {
      padding: 20px;
      color: #333333;
    }
    .email-body p {
      margin: 0 0 10px;
      line-height: 1.6;
    }
    .otp-code {
      display: block;
      text-align: center;
      font-size: 24px;
      color: #4CAF50;
      font-weight: bold;
      margin: 20px 0;
    }
    .reset-button {
      display: block;
      width: 200px;
      margin: 20px auto;
      padding: 10px 20px;
      text-align: center;
      background-color: #4CAF50;
      color: #ffffff;
      text-decoration: none;
      font-size: 16px;
      border-radius: 4px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    }
    .reset-button:hover {
      background-color: #45a049;
    }
    .email-footer {
      text-align: center;
      font-size: 12px;
      color: #999999;
      padding: 10px;
      background-color: #f4f4f4;
    }
    .email-footer a {
      color: #4CAF50;
      text-decoration: none;
    }
    .email-footer a:hover {
      text-decoration: underline;
    }
  </style>
</head>
<body>
  <div class="email-container">
    <div class="email-header">
      Reset Your Password
    </div>
    <div class="email-body">
      <p>Dear ${name},</p>
      <p>We received a request to reset the password for your account. Please use the OTP code below or click the button to reset your password:</p>
      <div class="otp-code">${code}</div>
      <a href="${baseUrl}/reset-password?token=${code}" class="reset-button">Reset Password</a>
      <p><strong>Note:</strong> This code and link are valid for 1 hour. If you did not request this, please ignore this email.</p>
    </div>
    <div class="email-footer">
      <p>If you have any questions, please contact our <a href="mailto:support@example.com">support team</a>.</p>
      <p>&copy; 2025 flight kiya. All rights reserved.</p>
    </div>
  </div>
</body>
</html>

    `;
};

export const verifyEmailTemplate = (
  name: string,
  code: string,
  baseUrl: string
) => {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Verify Your Email</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #f4f4f4;
      margin: 0;
      padding: 0;
    }
    .email-container {
      max-width: 600px;
      margin: 20px auto;
      background: #ffffff;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    }
    .email-header {
      background-color: #007BFF;
      color: #ffffff;
      text-align: center;
      padding: 20px 10px;
      font-size: 24px;
    }
    .email-body {
      padding: 20px;
      color: #333333;
    }
    .email-body p {
      margin: 0 0 10px;
      line-height: 1.6;
    }
    .otp-code {
      display: block;
      text-align: center;
      font-size: 24px;
      color: #007BFF;
      font-weight: bold;
      margin: 20px 0;
    }
    .verify-button {
      display: block;
      width: 200px;
      margin: 20px auto;
      padding: 10px 20px;
      text-align: center;
      background-color: #007BFF;
      color: #ffffff;
      text-decoration: none;
      font-size: 16px;
      border-radius: 4px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    }
    .verify-button:hover {
      background-color: #0056b3;
    }
    .email-footer {
      text-align: center;
      font-size: 12px;
      color: #999999;
      padding: 10px;
      background-color: #f4f4f4;
    }
    .email-footer a {
      color: #007BFF;
      text-decoration: none;
    }
    .email-footer a:hover {
      text-decoration: underline;
    }
  </style>
</head>
<body>
  <div class="email-container">
    <div class="email-header">
      Verify Your Email Address
    </div>
    <div class="email-body">
      <p>Dear ${name},</p>
      <p>Thank you for signing up! Please verify your email address by entering the OTP code below or clicking the button:</p>
      <div class="otp-code">${code}</div>
      <a href="${baseUrl}/verify-email?token=${code}" class="verify-button">Verify Email</a>
      <p><strong>Note:</strong> This code and link are valid for 24 hours. If you did not create an account, please ignore this email.</p>
    </div>
    <div class="email-footer">
      <p>If you have any questions, please contact our <a href="mailto:support@example.com">support team</a>.</p>
      <p>&copy; 2025 flight kiya. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
  `;
};

export const passwordUpdatedTemplate = (name: string, baseUrl: string) => {
  return `
  
  <!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Password Update Notification</title>
  <style type="text/css" media="all">
  body {
  font-family: Arial, sans-serif;
  background-color: #f4f4f4;
  margin: 0;
  padding: 0;
}

.email-container {
  max-width: 600px;
  margin: 30px auto;
  background: #ffffff;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  border: 1px solid #e0e0e0;
}

.email-header {
  background-color: #f6f9fc;
  color: #6772e5;
  text-align: center;
  padding: 20px;
}

.email-header h1 {
  font-size: 24px;
  margin: 0;
}

.email-body {
  padding: 20px 30px;
  color: #333;
  font-size: 16px;
  line-height: 1.6;
}

.email-body a {
  color: #6772e5;
  text-decoration: none;
}

.email-body a:hover {
  text-decoration: underline;
}

.email-footer {
  background-color: #f9f9f9;
  color: #666;
  font-size: 12px;
  text-align: center;
  padding: 15px;
  border-top: 1px solid #e0e0e0;
}

.email-footer p {
  margin: 5px 0;
}

.email-footer strong {
  color: #333;
}

    
  </style>
</head>
<body>
  <div class="email-container">
    <div class="email-header">
      <h1>Flight kiya</h1>
    </div>
    <div class="email-body">
      <p>Hello ${name},</p>
      <p>Your password has been successfully updated.</p>
      <p>
        If you did not perform this action, you should go to
        <a href="${baseUrl}">Flight Kiya</a>
        immediately to reset your password.
      </p>
      <p>
        To review this and other events that occur on your Stripe account, you
        can <a href="#">visit the security history page</a> in your Dashboard settings.
        If you see any suspicious activity on your account, please
        <a href="${baseUrl}/contact">contact us via our support site</a>.
      </p>
      <p>— The Flight kiya team</p>
    </div>
    <div class="email-footer">
      <p>&copy; 2025 flight kiya. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
`;
};
