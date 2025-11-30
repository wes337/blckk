import { createClient } from "redis";
import { NextResponse } from "next/server";
import EmailValidator from "email-validator";

const redis = await createClient({
  url: process.env.REDIS_URL,
}).connect();

export const POST = async (request) => {
  const body = await request.json();
  const email = body.email;

  if (!EmailValidator.validate(email)) {
    return new NextResponse(null, { status: 400 });
  }

  await redis.sAdd("emails", email);

  return new NextResponse(null, { status: 204 });
};
