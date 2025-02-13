'use client'
import { Line } from "react-chartjs-2";
import { 
    Chart as ChartJS, LinearScale,
    CategoryScale,
    Tooltip,
    Legend,
    PointElement,
    LineElement
} from 'chart.js';
import { SecurityCompanyData } from "@/lib/data/clientsdata";

ChartJS.register({
    LinearScale,
    CategoryScale,
    Tooltip,
    Legend,
    PointElement,
    LineElement
})

export function LineGraph(){

    const Options = {
        responsive: true,
        plugins:{
            title: {
                display: true,
                text: "Client's Growth"
            }
        }
    }
    return(
        <div className="w-1/2 h-full bg-white rounded-lg grid place-items-center">
            <Line options={Options} data={SecurityCompanyData}/>
        </div>
    )
}