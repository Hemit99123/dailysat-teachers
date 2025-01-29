import { getSessionInfo } from "@/lib/auth/employeeSession";
import { client } from "@/lib/mongo";
import { Session } from "@/types/session";
import { Db, ObjectId } from "mongodb";

export const POST = async (request: Request) => {
    const body = await request.json();

    const email = body.email;
    const schoolID = body.schoolID;
    
    // Get session info and check allowed schools
    const session = await getSessionInfo() as Session;
    const allowedSchools = session.schools;

    if (!allowedSchools.includes(schoolID)) {
        return Response.json({
            message: "Not authorized for that school"
        });
    }

    try {
        // Connect to MongoDB
        await client.connect();
        const db: Db = client.db("DailySAT");

        // Find the school by ID and check if the email exists in the students array
        const school = await db.collection("schools").findOne({
            _id: new ObjectId(schoolID),
            students: email // Check if the email is in the students array
        });

        if (!school) {
            return Response.json({
                message: "Email not found in the school's student list"
            });
        }

        // If email exists, fetch user info from the users collection
        const user = await db.collection("users").findOne({
            email: email
        });

        if (!user) {
            return Response.json({
                message: "User not found"
            });
        }

        // Return user information along with school info
        return Response.json({
            message: "User found",
            user,
        });
    } catch (error) {
        // Handle any errors that occur during the database operation
        return Response.json({
            error: error
        });
    } finally {
        // Ensure that the connection is closed after the operation
        await client.close();
    }
};
