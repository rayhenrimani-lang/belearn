// Test script to verify API connectivity
// This script helps test the API endpoints for different environments

const API_URL = "http://192.168.61.185:8001/api";

async function testAPI() {
  console.log("Testing API connectivity...");
  console.log("API URL:", API_URL);
  
  try {
    // Test register endpoint
    console.log("\n1. Testing POST /api/register");
    const registerResponse = await fetch(`${API_URL}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        nom: "Test", 
        prenom: "User", 
        telephone: "0123456789", 
        email: "test@example.com", 
        password: "password123" 
      }),
    });
    
    console.log("Register Status:", registerResponse.status);
    const registerData = await registerResponse.json();
    console.log("Register Response:", registerData);
    
    // Test login endpoint
    console.log("\n2. Testing POST /api/login");
    const loginResponse = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        email: "test@example.com", 
        password: "password123" 
      }),
    });
    
    console.log("Login Status:", loginResponse.status);
    const loginData = await loginResponse.json();
    console.log("Login Response:", loginData);
    
  } catch (error) {
    console.error("API Test Error:", error.message);
    
    if (error.message.includes('Failed to fetch')) {
      console.log("\n💡 Troubleshooting Tips:");
      console.log("1. Make sure Symfony API is running on port 8001");
      console.log("2. Check that your computer firewall allows connections on port 8001");
      console.log("3. Verify your phone is on the same WiFi network as your computer");
      console.log("4. Confirm the IP address 192.168.61.185 is correct");
      console.log("5. Try accessing http://192.168.61.185:8001/api in your browser");
    }
  }
}

// Run the test
testAPI();
