import * as schema from "./db/schema"
import * as relations from "./db/relations"
import {sqliteGenerate} from "drizzle-dbml-generator"
const out = "./schema.dbml";
const relational = true;

sqliteGenerate({ schema:{...schema,...relations}, out, relational });
