import { NextRequest, NextResponse } from "next/server";
import prisma from "~/server/db";

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const logAlertData = await request.json();

    // Update LogAlert
    const updatedLogAlert = await prisma.logAlert.update({
      where: { id },
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
      message: "Log alert updated successfully",
      logAlert: updatedLogAlert,
    });
  } catch (error) {
    console.error("Error updating log alert:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // Delete LogAlert
    await prisma.logAlert.delete({
      where: { id },
    });

    return NextResponse.json({
      message: "Log alert deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting log alert:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
