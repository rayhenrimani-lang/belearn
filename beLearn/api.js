const API_URL = "http://192.168.61.185:8001/api";

export async function registerUser(nom, prenom, telephone, email, password) {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
    
    const res = await fetch(`${API_URL}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nom, prenom, telephone, email, password }),
      signal: controller.signal,
    });
    
    clearTimeout(timeoutId);
    
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.message || errorData.error || `Erreur ${res.status}`);
    }
    
    return await res.json();
  } catch (error) {
    if (error.name === 'AbortError') {
      throw new Error('Le serveur ne répond pas à temps. Vérifiez que l\'API tourne (ex. port 8001) et l\'URL dans la config.');
    }
    if (error.message.includes('Network request failed') || error.message.includes('Failed to fetch')) {
      throw new Error('Pas de connexion réseau. Vérifiez votre réseau et l\'URL du serveur.');
    }
    console.log(error);
    throw error;
  }
}

export async function loginUser(email, password) {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
    
    const res = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
      signal: controller.signal,
    });
    
    clearTimeout(timeoutId);
    
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.message || errorData.error || `Erreur ${res.status}`);
    }
    
    return await res.json();
  } catch (error) {
    if (error.name === 'AbortError') {
      throw new Error('Le serveur ne répond pas à temps. Vérifiez que l\'API tourne (ex. port 8001) et l\'URL dans la config.');
    }
    if (error.message.includes('Network request failed') || error.message.includes('Failed to fetch')) {
      throw new Error('Pas de connexion réseau. Vérifiez votre réseau et l\'URL du serveur.');
    }
    console.log(error);
    throw error;
  }
}

export async function getProfile(token) {
  try {
    const res = await fetch(`${API_URL}/utilisateurs/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return await res.json();
  } catch (error) {
    console.log(error);
    return null;
  }
}