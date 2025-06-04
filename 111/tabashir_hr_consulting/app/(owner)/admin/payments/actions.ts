"use server";

import { prisma } from "@/lib/prisma";

export async function getPayments(page: number = 1, itemsPerPage: number = 10) {
  const skip = (page - 1) * itemsPerPage;
  
  const [payments, total] = await Promise.all([
    prisma.payment.findMany({
      skip,
      take: itemsPerPage,
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    }),
    prisma.payment.count(),
  ]);

  const totalPages = Math.ceil(total / itemsPerPage);

  return {
    payments,
    total,
    totalPages,
  };
}

