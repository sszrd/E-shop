import { useEffect, useState } from "react";
function useFetch<I>(url: string, options?: {}) {
    const [data, setData] = useState<I>();
    const [error, setError] = useState<unknown>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        let isMounted = true;
        setLoading(true);
        fetch(url, options)
            .then(res => res.json())
            .then(data => {
                if (isMounted) {
                    setData(data);
                    setError(null);
                }
            })
            .catch(error => {
                if (isMounted) {
                    setError(error);
                    setData(undefined);
                }
            })
            .finally(() => isMounted && setLoading(false));
        return () => { isMounted = false };
    }, [url, options]);

    return { loading, error, data };
};
export default useFetch;