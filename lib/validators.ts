import { z } from 'zod';

export const BaseModel = z.object({
  id: z.string().uuid().optional(),
  company: z.enum(['OMAN_OIL', 'NAMA']),
  refType: z.enum(['WO', 'WNSC']),
  refNumber: z.string().min(1),
  tags: z.array(z.string()).optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional()
});

export const WOModel = BaseModel.extend({
  refType: z.literal('WO'),
  company: z.literal('OMAN_OIL'),
  date: z.string().min(1),
  status: z.enum(['Open', 'WaitForApproval', 'Approved', 'Completed']),
  description: z.string().optional(),
  photosBefore: z.array(z.string()).optional(),
  photosAfter: z.array(z.string()).optional()
}).refine(v => !!v.refNumber && !!v.date, 'WO requires refNumber & date');

export const WNSCModel = BaseModel.extend({
  refType: z.literal('WNSC'),
  company: z.literal('NAMA'),
  startDate: z.string().min(1),
  endDate: z.string().optional(),
  durationDays: z.number().int().optional(),
  notes: z.string().optional()
}).refine(v => !!v.refNumber && !!v.startDate, 'WNSC requires refNumber & startDate')
  .refine(v => !v.endDate || new Date(v.endDate) >= new Date(v.startDate), 'endDate must be ≥ startDate');

export type RecordType = z.infer<typeof WOModel> | z.infer<typeof WNSCModel>;
