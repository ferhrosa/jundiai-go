import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { AngularFirestore, QueryFn } from '@angular/fire/firestore';

export class Entity {

    public id: string;

    public static toSaveable<T extends Entity>(entity: T): T {
        const saveable = Object.assign({}, entity as T);

        const convertArrays = (object) => {
            // tslint:disable-next-line:forin
            for (const item in object) {
                if (typeof (object[item]) === 'object') {
                    convertArrays(object[item]);
                }

                if (Array.isArray(object[item]) && typeof (object[item][0]) === 'object') {
                    object[item] = (object[item] as Array<any>).map(obj => Object.assign({}, obj));
                }
            }
        };

        convertArrays(saveable);

        delete saveable.id;
        return saveable;
    }

    public static getList<T extends Entity>(db: AngularFirestore, listPath: string, queryFn?: QueryFn): Observable<T[]> {
        return db.collection<T>(listPath, queryFn).snapshotChanges().pipe(map(
            actions => actions.map(
                a => {
                    const entity = a.payload.doc.data() as T;
                    entity.id = a.payload.doc.id;
                    return entity;
                }
            )
        ));
    }

}
