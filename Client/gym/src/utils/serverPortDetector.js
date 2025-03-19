// src/utils/serverPortDetector.js
import axios from 'axios';
import { updateServerPort } from '../api';

// Global variable to track if port detection is in progress
let portDetectionPromise = null;

// Function to detect the server port
export const detectServerPort = async () => {
    // If detection is already in progress, return the existing promise
    if (portDetectionPromise) {
        return portDetectionPromise;
    }
    
    // Create a new promise for port detection
    portDetectionPromise = new Promise(async (resolve) => {
        console.log('Attempting to detect server availability...');
        
        // Get API URL from environment variable
        const apiUrl = import.meta.env.VITE_API_URL || '/api';
        
        try {
            console.log(`Checking server connection at ${apiUrl}...`);
            const response = await axios.get(`${apiUrl}/health`, {
                timeout: 5000 // Increased timeout for better chance of connection
            });
            
            if (response.status === 200 || response.status === 404) {
                console.log('Server connection confirmed');
                updateServerPort();
                resolve(true);
                return true;
            }
        } catch (error) {
            if (error.response) {
                console.log('Server found (got response but not 200)');
                updateServerPort();
                resolve(true);
                return true;
            }
            console.log('Server not responding, but will proceed anyway');
        }
        
        // Always use the configured API URL regardless of connection status
        console.log('Using configured API URL');
        updateServerPort();
        resolve(true);
        return true;
    });
    
    // Reset the promise after 30 seconds to allow for fresh detection if needed
    setTimeout(() => {
        portDetectionPromise = null;
    }, 30000);
    
    return portDetectionPromise;
};

// Function to reset port detection
export const resetPortDetection = () => {
    portDetectionPromise = null;
};

export default detectServerPort; 