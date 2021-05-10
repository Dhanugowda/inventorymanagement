import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { SQLitePorter } from '@ionic-native/sqlite-porter/ngx';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx';
import { Platform } from '@ionic/angular';

export interface product {
  id: number;
  name: string;
  desc: string;
}

@Injectable({
  providedIn: 'root'
})

export class DatabaseService {
  private database: SQLiteObject;
  private dbReady: BehaviorSubject<boolean> = new BehaviorSubject(false);

  products = new BehaviorSubject([]);
  constructor(private plt: Platform, private sqlitePorter: SQLitePorter, private sqlite: SQLite, private http: HttpClient) {
    this.plt.ready().then(() => {
      this.sqlite.create({
        name: 'productsDatabase.db',
        location: 'default'
      })
      .then((db: SQLiteObject) => {
          this.database = db;
          this.seedDatabase();
      });
    });
  }

  seedDatabase() {
    this.http.get('assets/data.sql', { responseType: 'text'})
    .subscribe(sql => {
      this.sqlitePorter.importSqlToDb(this.database, sql)
        .then(_ => {
          this.loadproducts();
          this.dbReady.next(true);
        })
        .catch(e => console.error(e));
    });
  }

  getDatabaseState() {
    return this.dbReady.asObservable();
  }

  getproducts(): Observable<product[]> {
    return this.products.asObservable();
  }
  loadproducts() {
    return this.database.executeSql('SELECT * FROM products', []).then(data => {
      let products: product[] = [];

      if (data.rows.length > 0) {
        for (let i = 0; i < data.rows.length; i++) {
          products.push({
            id: data.rows.item(i).id,
            name: data.rows.item(i).name,
            desc: data.rows.item(i).desc 
          });
        }
      }
      this.products.next(products);
    });
  }
  addproductData(name,desc) {
    let data = [name, desc];
    return this.database.executeSql('INSERT INTO products (name, desc) VALUES (?, ?)', data).then(data => {
      this.loadproducts();
    });
  }
   getproductById(id): Promise<product> {
    return this.database.executeSql('SELECT * FROM products WHERE id = ?', [id]).then(data =>{
    return {
      id: data.rows.item(0).id,
      name: data.rows.item(0).name,
      desc: data.rows.item(0).desc
    }
  });
  }
  updateproduct(products: product) {
    let data = [products.name, products.desc];
    return this.database.executeSql(`UPDATE products SET name = ?, desc = ? WHERE studId = ${products.id}`, data).then(data => {
      this.loadproducts();
    });
  }
  deleteproduct(id) {
    console.log('Inside Deleting DB Product Id '+ id);
    return this.database.executeSql('DELETE FROM products WHERE studId = ?', [id]).then(_ => {
      this.loadproducts();
    });
  }
}


