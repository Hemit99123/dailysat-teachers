import { destorySession } from "@/lib/auth/employeeSession"

export const POST = async () => {
    const result = await destorySession()

    const message = result ? "Session gone" : "Session was NOT gone" // Simplified ternary logic based on result 
    
    // Return a response with a status code and message
    return Response.json({
        result: message
    })
}