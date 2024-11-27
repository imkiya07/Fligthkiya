import jwt from "jsonwebtoken";

// Function to generate a JWT token
export function generateToken(payload: any) {
  // Replace 'your-secret-key' with your actual secret key
  const secretKey = process.env.JWT_SECRET as string;

  // Options for token (e.g., expiry)
  const options = {
    expiresIn: "5d", // Token expires in 1 hour
  };

  // Generate the token
  const token = jwt.sign(payload, secretKey, options);
  return token;
}

// Function to verify a JWT token
export function verifyToken(token: string) {
  // Replace 'your-secret-key' with your actual secret key
  const secretKey = process.env.JWT_SECRET as string;

  console.log({ secretKey });

  try {
    // Verify the token
    const decoded = jwt.verify(token, secretKey);
    return decoded; // Return the decoded payload if verification is successful
  } catch (error: any) {
    // Handle invalid token
    console.error("Invalid token:", error.message);
    return null; // Return null if token is invalid or expired
  }
}
