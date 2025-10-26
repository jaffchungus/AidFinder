import { Low } from "lowdb";
import { JSONFile } from "lowdb/node";

type Data = {
  givers: Array<{
    giverId: string;
    city: string;
    zip: string;
    aidType: string;
    details: string;
  }>;
};

const adapter = new JSONFile<Data>("/tmp/db.json"); // Writable on Vercel, non-persistent
const defaultData: Data = { givers: [] };
const db = new Low<Data>(adapter, defaultData);

export default db;
