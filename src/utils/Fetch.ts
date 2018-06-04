export function asyncFetch<T>(url: string): Promise<T> {
  return fetch(url).then((response: any) => {
    if (response.ok) {
      return response.json().then((response: any) => response);
    }

    return response.json().then((error: any) => ({ error }));
  });
}
