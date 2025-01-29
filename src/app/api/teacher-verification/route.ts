import { client } from "@/lib/mongo";
import { Db, Document } from "mongodb";
import { redis } from "@/lib/auth/redis";
import { transporter } from "@/lib/nodemailer";
import otpGenerate from "@/lib/auth/otpGenerate";

export const POST = async (request: Request) => {
  const body = await request.json();
  const email = body.email;

  if (!email) {
    return Response.json({
      code: 400,
      error: "No email parameter"
    })
  }

  try {
    // Connect to MongoDB
    await client.connect();
    const db: Db = client.db("DailySAT");

    // Find schools where the teacher's email exists in the teachers array
    const schoolsCursor = db
      .collection("schools")
      .aggregate([
        {
          $match: { teachers: email }, // Find document where teacher's email is present
        },
        {
          $project: {
            schoolId: "$_id", // Return only the school ID (_id field)
            _id: 0 // Exclude the _id field from the result
          }
        }
      ]);

    const schoolsArray: Document[] = await schoolsCursor.toArray();
    if (schoolsArray.length === 0) {
      return Response.json({
        code: 403,
        error: "Email not authorized for any school"
      });
    }

    // Generate OTP
    const otp = await otpGenerate(12);

    // Store OTP in Redis
    await redis.set(`employee-${email}`, otp);
    await redis.expire(`employee-${email}`, 300); // Expire in 5 minutes

    // Send OTP email
    const mailOptions = {
      from: "hemitvpatel@gmail.com",
      to: email,
      subject: "Your OTP",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
              margin: 0;
              padding: 0;
              background-color: #f9f9f9;
            }
            .email-container {
              max-width: 600px;
              margin: 20px auto;
              padding: 20px;
              background-color: #ffffff;
              border: 1px solid #ddd;
              border-radius: 8px;
              box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            }
            .header {
              text-align: center;
              padding-bottom: 20px;
              border-bottom: 1px solid #ddd;
            }
            .header h1 {
              margin: 0;
              color: #333;
            }
            .otp {
              font-size: 24px;
              font-weight: bold;
              color: #2c7dfa;
              text-align: center;
              margin: 20px 0;
            }
            .footer {
              font-size: 14px;
              color: #666;
              text-align: center;
              margin-top: 20px;
            }
          </style>
        </head>
        <body>
          <div class="email-container">
            <div class="header">
              <h1>DailySAT Teachers</h1>
            </div>
            <p>Hello,</p>
            <p>Use the following One-Time Password (OTP) to complete your verification process:</p>
            <div class="otp">${otp}</div>
            <div class="footer">
              <p>If you did not request this, please ignore this email.</p>
            </div>
          </div>
        </body>
        </html>
      `,
    };

    // Send email through nodemailer
    await transporter.sendMail(mailOptions);

    // Return the list of school IDs the teacher is verified for
    const schoolIds = schoolsArray.map((school: any) => school.schoolId); // Extract schoolId from each school document

    return Response.json({
      code: 200,
      message: "OTP sent successfully",
      result: true,
      schools: schoolIds, // send the list of school IDs
    });
  } catch (error) {
    return Response.json({
      code: 500,
      error
    });
  } finally {
    // Close the MongoDB connection
    await client.close();
  }
};
