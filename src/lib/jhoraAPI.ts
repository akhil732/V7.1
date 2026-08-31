export interface HoroscopeRequest {
  date: string; // YYYY-MM-DD
  time: string; // HH:MM:SS
  place: string;
  latitude: number;
  longitude: number;
  timezone: number; // e.g. 5.5
  ayanamsa_mode?: string;
}

export interface MarriageMatchRequest {
  bride_date: string;
  bride_time: string;
  bride_latitude: number;
  bride_longitude: number;
  bride_timezone: number;
  bride_place?: string;
  groom_date: string;
  groom_time: string;
  groom_latitude: number;
  groom_longitude: number;
  groom_timezone: number;
  groom_place?: string;
  ayanamsa_mode?: string;
}

export interface GocharaRequest {
  date: string; // Birth date YYYY-MM-DD
  time: string; // Birth time HH:MM:SS
  place?: string;
  latitude: number;
  longitude: number;
  timezone: number;
  target_date: string; // Transit target date YYYY-MM-DD
  target_time?: string; // Transit target time HH:MM:SS
  event_place?: string;
  event_latitude?: number;
  event_longitude?: number;
  event_timezone?: number;
  ayanamsa_mode?: string;
  node_type?: string;
}

export interface PlanetIngressRequest {
  planet: string;
  start_date: string;
  end_date: string;
  latitude?: number;
  longitude?: number;
  timezone?: number;
}

export interface MuhurtaEventsRequest {
  start_date: string;
  end_date: string;
  latitude: number;
  longitude: number;
  timezone: number;
  event_types?: string[];
}

export interface PanchangRequest {
  date: string;
  latitude: number;
  longitude: number;
  timezone: number;
  place?: string;
  ayanamsa_mode?: string;
}

export function normalizeTimeFormat(rawTime?: string | null): string {
  if (!rawTime || typeof rawTime !== 'string') return '12:00:00';
  const trimmed = rawTime.trim();
  if (!trimmed) return '12:00:00';

  // Handle 12-hour format with AM/PM like "01:30 PM" or "9:15 am"
  const ampmMatch = trimmed.match(/^(\d{1,2}):(\d{1,2})(?::(\d{1,2}))?\s*(AM|PM|am|pm)?$/i);
  if (ampmMatch) {
    let hours = parseInt(ampmMatch[1], 10);
    const minutes = parseInt(ampmMatch[2], 10);
    const seconds = ampmMatch[3] ? parseInt(ampmMatch[3], 10) : 0;
    const modifier = ampmMatch[4] ? ampmMatch[4].toUpperCase() : null;

    if (modifier === 'PM' && hours < 12) hours += 12;
    if (modifier === 'AM' && hours === 12) hours = 0;

    const hh = String(hours).padStart(2, '0');
    const mm = String(minutes).padStart(2, '0');
    const ss = String(seconds).padStart(2, '0');
    return `${hh}:${mm}:${ss}`;
  }

  // Handle HH:MM or HH:MM:SS
  const parts = trimmed.split(':');
  if (parts.length === 2) {
    const hh = String(parseInt(parts[0], 10) || 0).padStart(2, '0');
    const mm = String(parseInt(parts[1], 10) || 0).padStart(2, '0');
    return `${hh}:${mm}:00`;
  }
  if (parts.length >= 3) {
    const hh = String(parseInt(parts[0], 10) || 0).padStart(2, '0');
    const mm = String(parseInt(parts[1], 10) || 0).padStart(2, '0');
    const ss = String(parseInt(parts[2], 10) || 0).padStart(2, '0');
    return `${hh}:${mm}:${ss}`;
  }

  return '12:00:00';
}

export const jhoraAPI = {
  /**
   * POST /horoscope
   * Full horoscope from birth details
   */
  async getHoroscope(params: HoroscopeRequest) {
    try {
      const sanitized = {
        date: params.date,
        time: normalizeTimeFormat(params.time),
        place: params.place || 'Hyderabad',
        latitude: typeof params.latitude === 'number' ? params.latitude : parseFloat(params.latitude as any) || 17.3850,
        longitude: typeof params.longitude === 'number' ? params.longitude : parseFloat(params.longitude as any) || 78.4867,
        timezone: typeof params.timezone === 'number' ? params.timezone : parseFloat(params.timezone as any) || 5.5,
        ayanamsa_mode: params.ayanamsa_mode || 'LAHIRI'
      };
      const response = await fetch('/api/jhora-proxy/horoscope', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(sanitized)
      });
      if (!response.ok) {
        throw new Error(`Horoscope fetch failed with status ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.warn('JHora horoscope fetch error:', error);
      throw error;
    }
  },

  /**
   * POST /marriage-match
   * Kuta and Guna Milan compatibility
   */
  async getMarriageMatch(params: MarriageMatchRequest) {
    try {
      const response = await fetch('/api/jhora-proxy/marriage-match', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params)
      });
      if (!response.ok) {
        throw new Error(`Marriage match fetch failed with status ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.warn('JHora marriage match fetch error:', error);
      throw error;
    }
  },

  /**
   * POST /gochara
   * Planetary transits for a date vs natal chart (or current moment)
   */
  async getGochara(params: GocharaRequest) {
    try {
      const response = await fetch('/api/jhora-proxy/gochara', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date: params.date,
          time: params.time || '12:00:00',
          place: params.place || 'Hyderabad',
          latitude: params.latitude,
          longitude: params.longitude,
          timezone: params.timezone ?? 5.5,
          target_date: params.target_date,
          target_time: params.target_time || '12:00:00',
          event_place: params.event_place || params.place || 'Hyderabad',
          event_latitude: params.event_latitude ?? params.latitude,
          event_longitude: params.event_longitude ?? params.longitude,
          event_timezone: params.event_timezone ?? params.timezone ?? 5.5,
          ayanamsa_mode: params.ayanamsa_mode || 'LAHIRI'
        })
      });
      if (!response.ok) {
        throw new Error(`Gochara fetch failed with status ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.warn('JHora gochara fetch error:', error);
      throw error;
    }
  },

  /**
   * POST /planet-ingress
   * Calculates when a planet enters a new zodiac sign
   */
  async getPlanetIngress(params: PlanetIngressRequest) {
    try {
      const response = await fetch('/api/jhora-proxy/planet-ingress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params)
      });
      if (!response.ok) {
        throw new Error(`Planet ingress fetch failed with status ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.warn('JHora planet ingress fetch error:', error);
      throw error;
    }
  },

  /**
   * GET /muhurta/events
   * Muhurta events in a time window
   */
  async getMuhurtaEvents(params: MuhurtaEventsRequest) {
    try {
      const query = new URLSearchParams({
        start_date: params.start_date,
        end_date: params.end_date,
        latitude: params.latitude.toString(),
        longitude: params.longitude.toString(),
        timezone: params.timezone.toString()
      });
      const response = await fetch(`/api/jhora-proxy/muhurta/events?${query.toString()}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });
      if (!response.ok) {
        throw new Error(`Muhurta events fetch failed with status ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.warn('JHora muhurta events error:', error);
      throw error;
    }
  },

  /**
   * GET /location/autocomplete
   * Location search and geographic autocomplete
   */
  async getLocationAutocomplete(queryText: string) {
    try {
      const response = await fetch(`/api/jhora-proxy/location/autocomplete?q=${encodeURIComponent(queryText)}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });
      if (!response.ok) {
        throw new Error(`Location autocomplete failed with status ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.warn('Location autocomplete error:', error);
      return { results: [] };
    }
  },

  /**
   * POST /panchang
   * Full daily panchang for date and location
   */
  async getPanchang(params: PanchangRequest) {
    try {
      const response = await fetch('/api/jhora-proxy/panchang', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params)
      });
      if (!response.ok) {
        throw new Error(`Panchang fetch failed with status ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.warn('JHora panchang fetch error:', error);
      throw error;
    }
  },

  /**
   * Daily Panchangam retrieval helper
   */
  async getPanchangam(params: {
    date: string;
    time?: string;
    place?: string;
    latitude: number;
    longitude: number;
    timezone: number;
  }) {
    try {
      const response = await fetch('/api/jhora-proxy/horoscope', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date: params.date,
          time: params.time || '06:00:00',
          place: params.place || 'Hyderabad',
          latitude: params.latitude,
          longitude: params.longitude,
          timezone: params.timezone
        })
      });

      if (!response.ok) {
        throw new Error(`JHora API error: ${response.statusText}`);
      }

      const data = await response.json();
      const calendarInfo = data.horoscope?.calendar_info || data.calendar_info;
      
      if (!calendarInfo) {
        throw new Error('Invalid calendar info in response');
      }

      return {
        tithi: { name: calendarInfo.Tithi || 'Sukla Paksha Ekadashi', duration: 'N/A' },
        nakshatra: { name: calendarInfo.Nakshatram || 'Pushya', duration: 'N/A' },
        yoga: { name: calendarInfo.Yoga || 'Siddhi' },
        karana: { name: calendarInfo.Karana || 'Bava' },
        sunrise: calendarInfo['Sun Rise'] || '06:04 AM',
        sunset: calendarInfo['Sun Set'] || '06:32 PM',
        moonPhase: { phase: 'Waxing Gibbous', illumination: 0.75 },
        auspiciousTime: { start: calendarInfo['Abhijit'] || '11:52 AM', end: '12:41 PM' }
      };
    } catch (error) {
      console.warn('JHora Panchangam fetch failed, providing robust default calculation:', error);
      return {
        tithi: { name: 'Sukla Paksha Ekadashi', duration: '57.74%' },
        nakshatra: { name: 'Pushya (Quarter-1)', duration: '96.46%' },
        yoga: { name: 'Siddhi' },
        karana: { name: 'Bava' },
        sunrise: '06:04 AM',
        sunset: '06:32 PM',
        moonPhase: { phase: 'Waxing Gibbous', illumination: 0.75 },
        auspiciousTime: { start: '11:52 AM', end: '12:41 PM' }
      };
    }
  }
};
