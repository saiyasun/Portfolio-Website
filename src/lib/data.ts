/** Fetch JSON content used by page features and generated metadata. */
export async function fetchJson<T = unknown>(url: string): Promise<T> {
    const response = await fetch(url);

    if (!response.ok) {
        throw new Error(`Failed to load ${url}: ${response.status}`);
    }

    return response.json() as Promise<T>;
}
