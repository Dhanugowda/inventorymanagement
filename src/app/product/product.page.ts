import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { DatabaseService, product } from '../services/database.service';

@Component({
  selector: 'app-product',
  templateUrl: './product.page.html',
  styleUrls: ['./product.page.scss'],
})
export class ProductPage implements OnInit {
  
  
  product: product = null;
  constructor(private router: Router, private route: ActivatedRoute, private db: DatabaseService, private toast: ToastController) { }
  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      let id = params.get('id');

      this.db.getproductById(id).then(data => {
        this.product = data;
      });
    });
  }

  updateproductData() {
    this.db.updateproduct(this.product).then(async (res) => {
      let toast = await this.toast.create({
        message: 'Product Details Updated Successfully..',
        duration: 3000
      });
      toast.present();
    }).then(() => this.router.navigateByUrl('products'));
  }
  delete() {
    console.log('Deleting Product id '+this.product.id);
    this.db.deleteproduct(this.product.id).then(() => {
      this.router.navigateByUrl('products');
    });
  }
}