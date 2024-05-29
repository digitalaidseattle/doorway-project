import { useEffect, useState } from "react";
import { supabaseClient } from "./supabaseClient";
import { loggingService } from "./loggingService";


export type AppConstant = {
    value: string,
    label: string
}
const cache: Record<string, AppConstant[]> = {}

const useAppConstants = (type: string) => {
    const [status, setStatus] = useState('idle');
    const [data, setData] = useState<AppConstant[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            setStatus('fetching');
            if (cache[type]) {
                const data = cache[type];
                setData(data);
                setStatus('fetched');
            } else {
                supabaseClient.from('app_constants')
                    .select()
                    .eq('type', type)
                    .then(response => {
                        console.log('response', response)
                        if (response.data) {
                            const data = response.data as AppConstant[];
                            cache[type] = data;
                            setData(data);
                            setStatus('fetched');
                        } else {
                            loggingService.error(response.statusText)
                            setData([]);
                            setStatus('fetched');
                        }
                    })
            }
        };

        fetchData();
    }, [type]);

    return { status, data };
};

export default useAppConstants;