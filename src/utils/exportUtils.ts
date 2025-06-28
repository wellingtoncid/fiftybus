import { createObjectCsvWriter } from 'csv-writer';
import path from 'path';
import fs from 'fs';

export async function exportLogsToCsv(logs: any[]) {
  const filePath = path.join(__dirname, '../../temp/audit-logs.csv');
  fs.mkdirSync(path.dirname(filePath), { recursive: true });

  const csvWriter = createObjectCsvWriter({
    path: filePath,
    header: [
      { id: 'id', title: 'ID' },
      { id: 'userId', title: 'User ID' },
      { id: 'action', title: 'Action' },
      { id: 'entity', title: 'Entity' },
      { id: 'entityId', title: 'Entity ID' },
      { id: 'metadata', title: 'Metadata' },
      { id: 'createdAt', title: 'Date' },
    ],
  });

  await csvWriter.writeRecords(logs);
  return filePath;
}
