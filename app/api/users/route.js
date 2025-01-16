import { NextResponse } from "next/server";
import { read_json } from "@/utils/jsonReader";

export async function GET(){
    try {
        
        const users = await read_json("db", "users.json");
        return NextResponse.json(users, {
            status: 200,
            headers: {
                "Content-Type": "application/json"
            }
        })
    } catch (error) {
        console.log(error.message);
        return NextResponse.json({error: error.message}, {status: 500});
    }
}