import { redis } from "@/lib/auth/redis";

export const GET = async (request: Request) => {
  try {
    const url = new URL(request.url);
    const passwordAttempt = url.searchParams.get("passwordAttempt");
    const email = url.searchParams.get("email");

    if (!email || !passwordAttempt) {
      return Response.json({
        code: 400,
        error: "Both email and OTP parameters are required",
      });
    }

    const storedOtp = await redis.get(`employee-${email}`);
    
    if (!storedOtp) {
      return Response.json({
        code: 404,
        error: "No OTP found or OTP expired"
      });
    }

    const isValid = storedOtp === passwordAttempt;

    if (isValid) {
      await redis.del(`employee-${email}`); // Clear OTP after successful verification
    }

    return Response.json({
      code: 200,
      result: isValid
    });

  } catch (error) {
    return Response.json({
      code: 500,
      error: "Internal server error",
      details: error
    });
  }
}
