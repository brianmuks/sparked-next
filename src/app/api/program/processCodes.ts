import { TProcessCode } from 'types/navigation';

//1000 - 1199
const PROGRAM_PROCESS_CODES = {
  PROGRAM_EXIST: 1000,
  PROGRAM_NOT_FOUND: 1001,
  PROGRAM_EDITED: 1002,
  PROGRAM_CREATED: 1003,
  SCHOOL_NOT_FOUND: 1004,
} satisfies TProcessCode;

export default PROGRAM_PROCESS_CODES;
