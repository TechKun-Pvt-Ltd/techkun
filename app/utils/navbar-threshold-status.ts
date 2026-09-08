type Listener = (status: boolean) => void;

function createNavbarThresholdStatus() {
    let status = false;
    const listeners = new Set<Listener>();

    return {
        get(): boolean {
            return status;
        },
        set(value: boolean): void {
            if (value === status) return;

            status = value;
            for (const listener of listeners) listener(status);
        },
        onChange(callback: Listener): () => void {
            listeners.add(callback);
            return () => listeners.delete(callback);
        }
    };
}

export default createNavbarThresholdStatus();