import { Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import prisma from "~/server/db";

export async function POST(request: NextRequest) {
  try {
    const logAlertData = await request.json();

    // Validate required fields
    const requiredFields = [
      "checkEvery",
      "logLimit",
      "severity",
      "environmentId",
      "token",
      "email",
    ];
    for (const field of requiredFields) {
      if (!(field in logAlertData)) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    // Create new LogAlert
    const newLogAlert = await prisma.logAlert.create({
      data: {
        checkEvery: logAlertData.checkEvery,
        logLimit: logAlertData.logLimit,
        severity: logAlertData.severity,
        title: logAlertData.title,
        description: logAlertData.description,
        userId: logAlertData.userId,
        filter: logAlertData.filter,
        serviceIds: logAlertData.serviceIds || [],
        environmentId: logAlertData.environmentId,
        token: logAlertData.token,
        email: logAlertData.email,
      },
    });

    return NextResponse.json({
      message: "Log alert created successfully",
      logAlert: newLogAlert,
    });
  } catch (error) {
    console.error("Error creating log alert:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const environmentId = searchParams.get("environmentId");

    const where: Prisma.LogAlertWhereInput = {
      environmentId: environmentId || undefined,
    };

    const logAlerts = await prisma.logAlert.findMany({
      where,
    });
    return NextResponse.json(logAlerts);
  } catch (error) {
    console.error("Error fetching log alert(s):", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
