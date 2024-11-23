interface IPInfoResponse {
    ip: string;
    country: string;
    error?: {
      title: string;
      message: string;
    };
  }
  
  const CACHE = new Map<string, { country: string; timestamp: number }>();
  const CACHE_DURATION = 60 * 60 * 1000;
  
  export async function getCountryFromIP(ip: string): Promise<string> {
    if (!ip || ip === '0.0.0.0' || ip === '127.0.0.1') {
      return process.env.TEST_COUNTRY || 'MA';
    }
  
    const cached = CACHE.get(ip);
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      return cached.country;
    }
  
    const token = process.env.IPINFO_TOKEN;
    if (!token) {
      return process.env.TEST_COUNTRY || 'MA';
    }
  
    try {
      const response = await fetch(`https://ipinfo.io/${ip}/json?token=${token}`, {
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'StreamVault/1.0'
        },
        cache: 'no-store'
      });
  
      if (!response.ok) {
        throw new Error(`IPInfo API error: ${response.status}`);
      }
  
      const data: IPInfoResponse = await response.json();
  
      if (data.error) {
        throw new Error(data.error.message);
      }
  
      const countryCode = data.country?.toUpperCase() || process.env.TEST_COUNTRY || 'MA';
  
      CACHE.set(ip, {
        country: countryCode,
        timestamp: Date.now()
      });
  
      return countryCode;
    } catch (error) {
      console.error(`Failed to get country for IP ${ip}:`, error);
      return process.env.TEST_COUNTRY || 'MA';
    }
  }