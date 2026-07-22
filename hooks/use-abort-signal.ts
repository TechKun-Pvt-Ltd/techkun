import {useConstant} from "@/hooks/use-constant";
import {useEffect} from "react";

const abortControllerInitializer = () => new AbortController();

export default function useAbortSignal() {
    const abortController = useConstant(abortControllerInitializer);
    useEffect(() => () => abortController.abort(), []);

    return abortController.signal;
}