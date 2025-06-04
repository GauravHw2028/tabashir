"use server";

import { prisma } from "@/lib/prisma";

export async function getUsers(page: number = 1, itemsPerPage: number = 10) {
  const skip = (page - 1) * itemsPerPage;
  
  const [users, total] = await Promise.all([
    prisma.user.findMany({
      skip,
      take: itemsPerPage,
      include: {
        candidate: {
          include: {
            profile: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    }),
    prisma.user.count(),
  ]);

  const totalPages = Math.ceil(total / itemsPerPage);

  return {
    users,
    total,
    totalPages,
  };
} 