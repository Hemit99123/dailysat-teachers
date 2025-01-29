import { getSessionInfo } from "@/lib/auth/employeeSession";
import { client } from "@/lib/mongo";
import { Session } from "@/types/session";
import { Db, Document, ObjectId } from "mongodb";

export const GET = async () => {

    const session = await getSessionInfo() as Session;

    // this is the schools that the teacher is allowed to access
    const allowedSchools = session.schools;

    try {
        // Connect to MongoDB
        await client.connect();
        const db: Db = client.db("DailySAT");

        // Query to find only the schools the teacher is allowed to access
        const schools = db.collection("schools").find({
            _id: { $in: allowedSchools.map(id => new ObjectId(id)) }  // for every id in allowedSchool, query to find the corresponding document
        });

        // Convert cursor to an array
        const schoolsArray: Document[] = await schools.toArray();

        if (schoolsArray.length === 0) {
            return Response.json({
                code: 404,
                error: "No schools found"
            });
        }

        // Return the filtered schools data as a response
        return Response.json({
            code: 200,
            result: schoolsArray,  // Send filtered schools data
        });
    } catch (error) {
        return Response.json({
            code: 500,
            error,
        });
    } finally {
        // Close the MongoDB connection
        await client.close();
    }
};
