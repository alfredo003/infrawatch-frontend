export function createEventSource<T>(
  url: string,
  onMessage: (data: T) => void,
  onError?: (err: any) => void,
) {
  const eventSource = new EventSource(url);

  eventSource.onmessage = (event) => {
    try {
      const data: T = JSON.parse(event.data);
      onMessage(data);
    } catch (err) {
      console.error('Erro ao parsear SSE:', err);
    }
  };

  eventSource.onerror = (err) => {
    console.error('Erro SSE:', err);
    onError?.(err);
    eventSource.close();
  };

  return eventSource;
}
