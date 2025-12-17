export async function fetchJSON<T>(
  url: string,
  revalidateSeconds?: number | false,
  options: RequestInit = {}
): Promise<T> {
  const fetchOptions: RequestInit & { next?: { revalidate?: number | false } } =
    {
      ...options,
      ...(revalidateSeconds !== undefined
        ? {
            cache: revalidateSeconds === false ? "no-store" : "force-cache",
            next: { revalidate: revalidateSeconds },
          }
        : { cache: "no-store" }),
    };

  try {
    const res = await fetch(url, fetchOptions);
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new Error(`Fetch failed ${res.status}: ${text}`);
    }
    return (await res.json()) as T;
  } catch (error) {
    console.error(`Error fetching ${url}:`, error);
    throw error;
  }
}
