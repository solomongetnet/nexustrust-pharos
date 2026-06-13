import { PinataSDK } from "pinata";
import dotenv from 'dotenv';

dotenv.config();

// Alternatively, if using the older @pinata/sdk package:
// import pinataSDK from '@pinata/sdk';

// Initialize the client
export const pinata = new PinataSDK({
  pinataJwt: process.env.PINATA_JWT,
  
});
