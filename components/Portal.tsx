"use client";
import {ReactNode, useEffect, useId, useSyncExternalStore} from "react";

type Listener = (id: string) => void;

function addAbortListener(
    signal: AbortSignal | undefined,
    abortListener: VoidFunction
) {
    if (signal?.aborted)
        abortListener();
    else if (signal)
        signal.addEventListener("abort", abortListener, { once: true });

    return abortListener;
}

interface PortalStore {
    onAdd(listener: Listener, signal?: AbortSignal): VoidFunction;
    onRemove(listener: Listener, signal?: AbortSignal): VoidFunction;
    onContentChange(listener: Listener, signal?: AbortSignal): VoidFunction;
    onContentChange(id: string, listener: Listener, signal?: AbortSignal): VoidFunction;
    getContent(id: string): ReactNode;
    getAllIds(): string[];
    setContent(id: string, token: string, content: ReactNode): void;
    clearContent(id: string, token: string): void;
}

function createPortalStore(): PortalStore {
    const owners = new Map<string, string>(); // id -> token
    const contents = new Map<string, ReactNode>(); // id -> content

    const addListeners = new Set<Listener>();
    const removeListeners = new Set<Listener>();
    const contentListeners = new Set<Listener>();
    const contentListenersById = new Map<string, Set<Listener>>(); // id -> listeners for that id only

    function notifyAdd(id: string) {
        for (const l of addListeners) l(id);
    }
    function notifyRemove(id: string) {
        for (const l of removeListeners) l(id);
    }
    function notifyContentChange(id: string) {
        for (const l of contentListenersById.get(id) ?? []) l(id);
        for (const l of contentListeners) l(id);
    }

    let idsSnapshot: string[] = [];
    function rebuildIdsSnapshot() {
        idsSnapshot = Array.from(contents.keys());
    }

    return {
        onAdd(listener, signal) {
            addListeners.add(listener);
            return addAbortListener(signal, () => addListeners.delete(listener));
        },
        onRemove(listener, signal) {
            removeListeners.add(listener);
            return addAbortListener(signal, () => removeListeners.delete(listener));
        },
        onContentChange(...args: [Listener, signal?: AbortSignal] | [string, Listener, signal?: AbortSignal]) {
            if (typeof args[0] === "function") {
                const listener = args[0];
                contentListeners.add(listener);
                return addAbortListener(args[1] as AbortSignal | undefined, () => contentListeners.delete(listener));
            }

            const [id, listener, signal] = args as [string, Listener, signal?: AbortSignal];

            let group = contentListenersById.get(id);
            if (!group)
                contentListenersById.set(id, group = new Set());

            group.add(listener);

            return addAbortListener(
                signal,
                () => {
                    group.delete(listener);
                    if (group.size === 0) contentListenersById.delete(id);
                }
            );
        },
        getContent(id) {
            return contents.get(id);
        },
        getAllIds() {
            return idsSnapshot;
        },
        // Only the owning token may write content for an id.
        // The first token to write for a given id becomes the owner.
        setContent(id, token, content) {
            const owner = owners.get(id);
            const exists = owner !== undefined;
            if (exists && owner !== token) return;

            if (!exists) {
                owners.set(id, token);
                contents.set(id, content);
                rebuildIdsSnapshot();
                notifyAdd(id);
            } else {
                contents.set(id, content);
            }

            notifyContentChange(id);
        },
        // Only the owner can clear, freeing the id for another instance.
        clearContent(id, token) {
            if (owners.get(id) !== token) return;

            owners.delete(id);
            contents.delete(id);
            rebuildIdsSnapshot();

            notifyRemove(id);
            notifyContentChange(id); // so that anyone watching this id sees it go away
        }
    };
}

const store = createPortalStore();

function usePortalRegistration(id: string, content: ReactNode) {
    const token = useId();

    // Write during render: first-mounted instance in tree order wins
    // ownership; everyone else is a no-op.
    store.setContent(id, token, content);

    useEffect(() => {
        store.setContent(id, token, content);
    }, [content]);
    useEffect(() => {
        store.setContent(id, token, content); // re-affirm (handles StrictMode)
        return () => store.clearContent(id, token);
    }, [id, token]);
}

function getServerContentSnapshot() {
    return null;
}
function useContentSnapshot(id: string): ReactNode {
    function subscribe(listener: VoidFunction) {
        return store.onContentChange(id, listener);
    }
    function getSnapshot() {
        return store.getContent(id);
    }
    return useSyncExternalStore(subscribe, getSnapshot, getServerContentSnapshot);
}

/** Registers `children` under `id`. Only the first mounted instance for a
 *  given id contributes content; others are ignored until the owner
 *  unmounts, at which point the next instance takes over. Renders nothing. */
export function Portal({ id, children }: { id: string; children?: ReactNode }) {
    usePortalRegistration(id, children);
    return null;
}

/** Renders whatever content is currently registered for `id`. */
export function PortalOutlet({ id }: { id: string }) {
    return useContentSnapshot(id);
}

const serverIdsSnapshot: string[] = [];
function getServerIdsSnapshot() {
    return serverIdsSnapshot;
}

/** Renders every currently registered id's content, in registration order. */
export function PortalOutlets() {
    function subscribe(listener: VoidFunction) {
        const abortController = new AbortController();
        store.onAdd(listener, abortController.signal);
        store.onContentChange(listener, abortController.signal);
        store.onRemove(listener, abortController.signal);
        return () => abortController.abort();
    }
    return useSyncExternalStore(subscribe, store.getAllIds, getServerIdsSnapshot)
        .map(store.getContent);
}