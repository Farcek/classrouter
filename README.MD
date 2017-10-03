class based typescript route express route

# sample route
```
import *  as classrouter from 'classrouter';
import { IModels } from 'eggly2-core';


@classrouter.GET
export class userList implements classrouter.IRoute {
    @classrouter.QueryParam()
    @classrouter.typecast.str2int()
    page: number = 1


    @classrouter.QueryParam()
    @classrouter.typecast.str2int()
    limit: number = 10

    async action() {
        let rsu = await IModels.findAndCountAll({
            limit: this.limit, offset: this.limit * (this.page - 1),
            order: 'id DESC'
        })
        return {
            total: rsu.count,
            items: rsu.rows.map(it => {
                return {
                    id: it.id,
                    name: it.name,
                    status: IModels.IInfoMessage.Status[it.status]
                }
            })
        }
    }
}


@classrouter.SubRouter( userList )
export class user {}
```


# express attache
```
import * as express from "express";
import {attach} from "classrouter";

import {list} from "./list";

export const router = express.Router();

const app = express();

app.use('/api',attach(router,user, 'Api')) ;

```

# error handke
```
import "reflect-metadata";
import * as express from "express";

...

errorHandle((err, req, resp, next) => {
        if (err instanceof classrouter.ClassrouterValidationError) {
            let resu: classrouter.ClassrouterValidationError = err;
            let results = [];

            let fn = (err, parantKey) => {
                if (err && Array.isArray(err)) {                    
                    err.forEach(it => {                        
                        if (it && it.constraints) {
                            Object.keys(it.constraints).forEach((k) => {
                                results.push({
                                    property: parantKey ? parantKey + ':' + it.property : it.property,
                                    message: it.constraints[k]
                                });
                            })
                        }
                        if (it && it.children) {
                            it.children.forEach(fn, it.property);
                        }
                    })
                }
            }

            fn(resu.errors, '');

            resp.status(400);

            resp.json({
                name: 'validationerror',
                message: 'validation Error',
                errors: results
            })
        } else {
            next(err);
        }
    })
```