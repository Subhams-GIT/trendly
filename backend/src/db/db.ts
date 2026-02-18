import 'dotenv/config';
import { drizzle, LibSQLDatabase } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import * as schema from "./schema"


export class dbClient{
    static instance:LibSQLDatabase<typeof schema>|null=null;

    private constructor(){}

    static getInstance(){
        if(!dbClient.instance){
            const client=createClient({url:process.env.DBFILE_NAME!})
            dbClient.instance=drizzle({client,schema})
        }
        return dbClient.instance;
    }
}
