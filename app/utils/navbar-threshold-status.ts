const NAVBAR_THRESHOLD_STATUS_CHANGE = 'navbar-threshold-status-change' as const;

declare global {
    interface DocumentEventMap {
        [NAVBAR_THRESHOLD_STATUS_CHANGE]: CustomEvent<boolean>;
    }
}

function createNavbarThresholdStatus() {
    let status = false;

    return {
        get(): boolean {
            return status;
        },
        set(value: boolean): void {
            status = value;

            document.dispatchEvent(
                new CustomEvent(NAVBAR_THRESHOLD_STATUS_CHANGE, { detail: status })
            );
        },
        onChange(callback: (status: boolean) => void): () => void {
            function listener(event: CustomEvent<boolean>) {
                callback(event.detail);
            }

            document.addEventListener(NAVBAR_THRESHOLD_STATUS_CHANGE, listener);

            return () => {
                document.removeEventListener(
                    NAVBAR_THRESHOLD_STATUS_CHANGE,
                    listener,
                );
            };
        }
    };
}

export default createNavbarThresholdStatus();