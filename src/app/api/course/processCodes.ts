import { TProcessCode } from 'types/navigation';

//1200 - 1399
const COURSE_PROCESS_CODES = {
  COURSE_EXIST: 1200,
  COURSE_NOT_FOUND: 1201,
  COURSE_EDITED: 1202,
  COURSE_CREATED: 1203,
  SCHOOL_NOT_FOUND: 1204,
  PROGRAM_NOT_FOUND: 1205,
} satisfies TProcessCode;

export default COURSE_PROCESS_CODES;
