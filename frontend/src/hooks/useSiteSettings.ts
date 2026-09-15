import { useEffect, useState } from 'react';
import { fetchSiteSettings } from '../lib/api';

type SiteSettingsState = Awaited<ReturnType<typeof fetchSiteSettings>>['data'] | null;

let cached: SiteSettingsState | null = null;
let fetched = false;

export function useSiteSettings() {
  const [data, setData] = useState<SiteSettingsState>(cached);
  const [loading, setLoading] = useState(!fetched);

  useEffect(() => {
    if (fetched) return;
    fetched = true;
    fetchSiteSettings()
      .then((res) => {
        cached = res.data;
        setData(res.data);
      })
      .catch(() => {
        // backend unavailable — keep static defaults
      })
      .finally(() => setLoading(false));
  }, []);

  return { data, loading };
}
