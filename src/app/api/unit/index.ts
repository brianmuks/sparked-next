import SPARKED_PROCESS_CODES from 'app/shared/processCodes';
import { BSON } from 'mongodb';
import { z } from 'zod';
import { zfd } from 'zod-form-data';
import { dbClient } from '../lib/db';
import { dbCollections } from '../lib/db/collections';
import { p_fetchUnitsWithMetaData } from './pipelines';
import { UNIT_FIELD_NAMES_CONFIG } from './constants';
import { getDbFieldNamesConfigStatus } from '../config';
import { T_RECORD } from 'types';

const dbConfigData = UNIT_FIELD_NAMES_CONFIG;

export default async function fetchUnits_(request: any) {
  const schema = zfd.formData({
    limit: zfd.numeric(),
    skip: zfd.numeric(),
    withMetaData: zfd.text().optional(),
  });
  const params = request.nextUrl.searchParams;

  const { limit, skip, withMetaData } = schema.parse(params);
  const isWithMetaData = Boolean(withMetaData);

  try {
    const db = await dbClient();

    if (!db) {
      const response = {
        isError: true,
        code: SPARKED_PROCESS_CODES.DB_CONNECTION_FAILED,
      };
      return new Response(JSON.stringify(response), {
        status: 200,
      });
    }

    let units = [];

    const project = await getDbFieldNamesConfigStatus({ dbConfigData });

    if (isWithMetaData) {
      units = await db
        .collection(dbCollections.units.name)
        .aggregate(p_fetchUnitsWithMetaData({ query: {}, project }))
        .toArray();
    } else {
      units = await db
        .collection(dbCollections.units.name)
        .find(
          {},
          {
            limit,
            skip,
          },
        )
        .toArray();
    }

    const response = {
      isError: false,
      units,
    };

    return new Response(JSON.stringify(response), {
      status: 200,
    });
  } catch (error) {
    const resp = {
      isError: true,
      code: SPARKED_PROCESS_CODES.UNKNOWN_ERROR,
    };

    return new Response(JSON.stringify(resp), {
      status: 200,
    });
  }
}

export async function fetchUnitById_(request: any) {
  const schema = zfd.formData({
    unitId: zfd.text(),
    withMetaData: z.boolean().optional(),
  });
  const params = request.nextUrl.searchParams;

  const { unitId, withMetaData } = schema.parse(params);
  const isWithMetaData = Boolean(withMetaData);

  try {
    const db = await dbClient();

    if (!db) {
      const response = {
        isError: true,
        code: SPARKED_PROCESS_CODES.DB_CONNECTION_FAILED,
      };
      return new Response(JSON.stringify(response), {
        status: 200,
      });
    }
    const project = await getDbFieldNamesConfigStatus({ dbConfigData });

    let unit: T_RECORD | null;

    if (isWithMetaData) {
      const units = await db
        .collection(dbCollections.units.name)
        .aggregate(
          p_fetchUnitsWithMetaData({
            project,
            query: {
              _id: new BSON.ObjectId(unitId),
            },
          }),
        )
        .toArray();

      unit = units.length ? units[0] : {};
    } else {
      unit = await db.collection(dbCollections.units.name).findOne({ _id: new BSON.ObjectId(unitId) });
    }

    const response = {
      isError: false,
      unit,
    };

    return new Response(JSON.stringify(response), {
      status: 200,
    });
  } catch (error) {
    const resp = {
      isError: true,
      code: SPARKED_PROCESS_CODES.UNKNOWN_ERROR,
    };

    return new Response(JSON.stringify(resp), {
      status: 200,
    });
  }
}

export async function deleteUnits_(request: Request) {
  const schema = zfd.formData({
    unitIds: zfd.repeatableOfType(zfd.text()),
  });
  const formBody = await request.json();

  const { unitIds } = schema.parse(formBody);

  try {
    const db = await dbClient();

    if (!db) {
      const response = {
        isError: true,
        code: SPARKED_PROCESS_CODES.DB_CONNECTION_FAILED,
      };
      return new Response(JSON.stringify(response), {
        status: 200,
      });
    }

    const results = await db.collection(dbCollections.units.name).deleteMany({
      _id: {
        $in: unitIds.map((i) => new BSON.ObjectId(i)),
      },
    });

    const response = {
      isError: false,
      results,
    };

    return new Response(JSON.stringify(response), {
      status: 200,
    });
  } catch (error) {
    const resp = {
      isError: true,
      code: SPARKED_PROCESS_CODES.UNKNOWN_ERROR,
    };

    return new Response(JSON.stringify(resp), {
      status: 200,
    });
  }
}

export async function findUnitsByName_(request: any) {
  const schema = zfd.formData({
    name: zfd.text(),
    skip: zfd.numeric(),
    limit: zfd.numeric(),
    withMetaData: zfd.text().optional(),
  });
  const params = request.nextUrl.searchParams;

  const { name, limit, skip, withMetaData } = schema.parse(params);
  const isWithMetaData = Boolean(withMetaData);

  try {
    const db = await dbClient();

    if (!db) {
      const response = {
        isError: true,
        code: SPARKED_PROCESS_CODES.DB_CONNECTION_FAILED,
      };
      return new Response(JSON.stringify(response), {
        status: 200,
      });
    }
    const regexPattern = new RegExp(name, 'i');
    const project = await getDbFieldNamesConfigStatus({ dbConfigData });

    let units = null;

    if (isWithMetaData) {
      units = await db
        .collection(dbCollections.units.name)
        .aggregate(
          p_fetchUnitsWithMetaData({
            project,
            query: {
              name: { $regex: regexPattern },
            },
          }),
        )
        .toArray();
    } else {
      units = await db
        .collection(dbCollections.units.name)
        .find({
          name: { $regex: regexPattern },
        })
        .toArray();
    }

    const response = {
      isError: false,
      units,
    };

    return new Response(JSON.stringify(response), {
      status: 200,
    });
  } catch (error) {
    const resp = {
      isError: true,
      code: SPARKED_PROCESS_CODES.UNKNOWN_ERROR,
    };

    return new Response(JSON.stringify(resp), {
      status: 200,
    });
  }
}
