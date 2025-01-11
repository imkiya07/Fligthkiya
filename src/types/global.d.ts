// ./global.d.ts

import { IAuthUser } from "../api/auth/authInterfaces";

// Custom matchers interface for Jest
interface CustomMatchers<R = unknown> {
  nullOrAny(classType: any): R;
}

declare global {
  namespace Express {
    interface Request {
      user: IAuthUser; // User identifier
      role_id: number; // Role ID for permissions
      agency_id: number; // Agency ID
      agency: number[]; // Array of agency IDs
      user_id: number; // User ID
      upFolder: string; // Upload folder path
      imgUrl: string; // Array of image URLs
      upFiles: string[]; // Array of uploaded file names
      deviceId: string;
      image_files: {
        [fieldname: string]: string; // Object for image files with field names
      };
    }
  }

  namespace jest {
    interface Expect extends CustomMatchers {}
    interface Matchers<R> extends CustomMatchers<R> {}
    interface InverseAsymmetricMatchers extends CustomMatchers {}
  }
}

// Ensuring the file is treated as a module
export {};
