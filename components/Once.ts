"use client";
import {ReactNode, useEffect, useId, useSyncExternalStore} from "react";

interface OnceStore {
    subscribe(listener: VoidFunction): VoidFunction;
    isOwner(id: string, token: string): boolean;
    claim(id: string, token: string): void;
    release(id: string, token: string): void;
}

/**
 * A tiny external store that tracks, per id, which component instance
 * (token) currently "owns" the right to render.
 */
function createOnceStore(): OnceStore {
    const owners = new Map(); // id -> token
    const listeners = new Set<VoidFunction>();

    function notify() {
        for (const l of listeners) l();
    }

    return {
        subscribe(listener) {
            listeners.add(listener);
            return () => listeners.delete(listener);
        },
        isOwner(id, token) {
            return owners.get(id) === token;
        },
        // Claim is a no-op if someone already owns this id.
        claim(id, token) {
            if (owners.has(id)) return;

            owners.set(id, token);
            notify();
        },
        // Only the current owner can release its own claim.
        release(id, token) {
            if (owners.get(id) !== token) return;

            owners.delete(id);
            notify();
        }
    };
}

const store = createOnceStore();

export function useRenderOnce(id: string) {
    const token = useId();

    // Claim during render (not in an effect) so that whichever instance
    // React renders *first* for this id wins, matching tree order.
    // This is idempotent: if someone already owns `id`, it's a no-op.
    store.claim(id, token);

    // Release on unmount (or if `id` changes) so another instance can
    // take over rendering.
    useEffect(() => {
        store.claim(id, token); // re-affirm ownership after commit (handles StrictMode)
        return () => store.release(id, token);
    }, [id, token]);

    function getSnapshot() {
        return store.isOwner(id, token);
    }
    return useSyncExternalStore(
        store.subscribe, getSnapshot, getSnapshot
    );
}

export function Once({ id, children }: { id: string, children?: ReactNode }) {
    if (useRenderOnce(id))
        return children;

    return null;
}