import { prisma } from '../lib/prisma';

interface CreateReportData {
  type: 'sales' | 'trips' | 'reviews';
  startDate: Date;
  endDate: Date;
  generatedById: string;
  filePath: string;
}

export async function createReport(data: CreateReportData) {
  return prisma.report.create({
    data: {
      type: data.type,
      startDate: data.startDate,
      endDate: data.endDate,
      generatedById: data.generatedById,
      filePath: data.filePath,
    },
  });
}

export async function getReportById(id: string) {
  return prisma.report.findUnique({
    where: { id },
    include: { generatedBy: true },
  });
}

export async function listReports() {
  return prisma.report.findMany({
    include: { generatedBy: true },
    orderBy: { startDate: 'desc' },
  });
}

export async function updateReport(id: string, data: Partial<CreateReportData>) {
  return prisma.report.update({
    where: { id },
    data,
  });
}

export async function deleteReport(id: string) {
  return prisma.report.delete({
    where: { id },
  });
}

interface ReportFilter {
  type?: 'sales' | 'trips' | 'reviews';
  startDate?: string; // ISO date string
  endDate?: string;   // ISO date string
  generatedById?: string;
}

export async function listReportsFiltered(filters: ReportFilter) {
  const where: any = {};

  if (filters.type) where.type = filters.type;

  if (filters.startDate || filters.endDate) {
    where.startDate = {};
    if (filters.startDate) where.startDate.gte = new Date(filters.startDate);
    if (filters.endDate) where.startDate.lte = new Date(filters.endDate);
  }

  if (filters.generatedById) where.generatedById = filters.generatedById;

  return prisma.report.findMany({
    where,
    include: { generatedBy: true },
    orderBy: { startDate: 'desc' },
  });
}

export async function getSalesSummary(startDate: Date, endDate: Date) {
  const result = await prisma.$queryRaw<
    { totalSales: number | null }[]
  >`
    SELECT SUM(amount) AS "totalSales"
    FROM "Payment"
    WHERE "paidAt" BETWEEN ${startDate} AND ${endDate}
      AND status = 'approved'
  `;

  return result[0].totalSales || 0;
}