import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { DatabaseService, product } from '../services/database.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.page.html',
  styleUrls: ['./products.page.scss'],
})
export class ProductsPage implements OnInit {

  constructor(private db: DatabaseService) { }

   productData = {};
   products: product[] = [];
   ngOnInit() {
     this.db.getDatabaseState().subscribe(rdy => {
       if (rdy) {
         this.db.getproducts().subscribe(prod => {
           this.products = prod;
           console.log(this.products);
         });
       }
     });
   }
   addStudentDetails() {
     this.db.addproductData(this.productData['name'], this.productData['desc']).then(_ => {
       this.productData = {};
     });
   }
  }

