import { Component, OnInit, OnDestroy } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { ShopService } from 'src/app/services/shop.service';
import { MatDialog } from '@angular/material';
import { RepDialogComponent } from '../rep-dialog/rep-dialog.component';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';



@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.css']
})
export class ShopComponent implements OnInit, OnDestroy {

  user: any;
  products: any;
  cols: any;
  category: any;
  enlargedView: boolean = false;
  currentCategory: string;
  searchValue: string = null;
  userCartProducts: any;
  myCart: any;
  cartItems: any;
  myProducts: any[] = [];
  orderCost: number = 0;
  firstUse: boolean = true;
  submitted: boolean = false;
  sidebarIsOpen: boolean = false;
  AdminEditMode: boolean = false;
  prodID: string;
  selectedProdToEdit: string;
  adminAddmode: boolean = false;
  sidebarSmartphone: boolean;
  loadingCart: boolean = true;
  loadingProducts: boolean = true;
  hasLoaded: number = 0;
  loadingComplete:boolean = false;
  cartRefresh:boolean = false;

  constructor(private userService: UserService, private shopService: ShopService, public dialog: MatDialog, private router: Router) { }

  adminModeSidebar(): void {
    if (this.sidebarIsOpen) {
      this.toggleSidebar()
    }
  }

  toggleSidebar(): void {

    this.sidebarIsOpen = !this.sidebarIsOpen;

    document.getElementById("sidebar").classList.toggle('active');
    if (window.innerWidth < 769) {
      if (document.getElementsByClassName("wrapper")[0].clientWidth > 100) {
        this.sidebarSmartphone = true;
        setTimeout(() => {
          this.sidebarSmartphone = false;
        }, 1000);
        document.getElementById("sidebar").style.display = "none";
      }
      else {
        document.getElementById("sidebar").style.display = "flex";
      }
    }

    setTimeout((): void => {

      this.onResize()
    }, 600);

  }

  collapser(): void {
    document.getElementById('homeSubmenu').classList.toggle('jbCollapse');
  }

  openRepDialog(ev: any): void {
    const dialogRef: any = this.dialog.open(RepDialogComponent, {
      width: '250px',
      data: {
        product: ev.target.parentElement.parentElement,
        user: this.user
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.myProducts = [];
        this.getUserProducts();
      }
    });
  }

  chooseProdToEdit(ev: any): void {
    this.submitted = false;
    this.AdminEditMode = true
    this.prodID = ev.target.parentElement.parentElement.children[0].id;
    this.adminModeSidebar();

    this.shopService.adminSearchProduct(this.prodID).subscribe(data => {
      if (data[0]._id == this.prodID) {
        this.f5.addProdTitle.setValue(data[0].title);
        this.f5.addProdDescription.setValue(data[0].description);
        this.f5.addProdPrice.setValue(data[0].price);
        this.f5.addProdCategory.setValue(data[0].type);
        this.f5.addProdImg.setValue(data[0].url);
      }
    })
  }

  boss_editProduct(): void {
    this.submitted = true;
    if (this.addProduct.valid) {
      this.shopService.adminEditProduct({
        prodID: this.prodID,
        title: this.f5.addProdTitle.value,
        type: this.f5.addProdCategory.value,
        description: this.f5.addProdDescription.value,
        url: this.f5.addProdImg.value,
        price: this.f5.addProdPrice.value
      }).subscribe(data => {
        if (this.prodID === data._id) {
          this.ngOnInit();
        }
      });
    }
  }

  reassignType(): void {
    var prodType: string;
    if ((<HTMLElement>document.getElementById("selectType").children[0].children[0].children[0].children[0]).innerText == "Dairy") {
      prodType = "dairy"
    }
    if ((<HTMLElement>document.getElementById("selectType").children[0].children[0].children[0].children[0]).innerText == "Vegetable") {
      prodType = "vegetable"
    }
    if ((<HTMLElement>document.getElementById("selectType").children[0].children[0].children[0].children[0]).innerText == "Fruit") {
      prodType = "fruit"
    }
    if ((<HTMLElement>document.getElementById("selectType").children[0].children[0].children[0].children[0]).innerText == "Pastry") {
      prodType = "bakery"
    }
    if ((<HTMLElement>document.getElementById("selectType").children[0].children[0].children[0].children[0]).innerText == "Eggs & Meat") {
      prodType = "meat"
    }
    if (this.adminAddmode) {
      this.addProduct.reset();
      this.adminAddmode = false;
    }
    document.getElementById(prodType).click();
  }

  Boss_goToAddNewProduct(): void {
    this.submitted = false;
    this.AdminEditMode = false;
    this.addProduct.reset();
  }

  get f5(): any { return this.addProduct.controls; }

  addProduct: FormGroup = new FormGroup({

    addProdTitle: new FormControl(null, [Validators.required]),
    addProdDescription: new FormControl(null, [Validators.required]),
    addProdPrice: new FormControl(null, [Validators.required, Validators.max(999), Validators.min(0.001)]),
    addProdCategory: new FormControl(null, [Validators.required]),
    addProdImg: new FormControl(null, [Validators.required])

  });

  activator(e): void {

    for (let i: number = 0; i < document.getElementsByClassName('navCat').length; i++) {
      document.getElementsByClassName('navCat')[i].classList.remove("activateCategory");
    }
    e.target.classList.add("activateCategory");

    for (let i: number = 0; i < document.getElementsByClassName('nav-link').length; i++) {
      document.getElementsByClassName('nav-link')[i].classList.remove("activateCategory");
    }
    e.target.classList.add("activateCategory");


    this.userService.categories().subscribe(assignCategory => {
      this.currentCategory = assignCategory.map((t: any): void => t).filter((cat: any): boolean => { return cat.category === e.target.id })[0]._id

      this.userService.getProducts().subscribe(getProductFromAssignedCategory => {
        this.products = getProductFromAssignedCategory.map(getProductFromAssignedCategory => getProductFromAssignedCategory);
        this.category = this.products.filter((categ: any): boolean => { return categ.type === this.currentCategory });

      })
    })


  }

  searchProduct(): void {

    this.userService.getProducts().subscribe((data: any): void => {
      data.map(data => data.title = data.title.toLowerCase());
      this.category = data.filter((product) => product.title.includes(this.searchValue.toLowerCase()));
    });

    for (let i: number = 0; i < document.getElementsByClassName('navCat').length; i++) {
      document.getElementsByClassName('navCat')[i].classList.remove("activateCategory");
    }
    for (let i: number = 0; i < document.getElementsByClassName('nav-link').length; i++) {
      document.getElementsByClassName('nav-link')[i].classList.remove("activateCategory");
    }
  }

  onResize(): void {
    this.cols = parseInt(((document.getElementsByClassName("shopProducts")[0].clientWidth) / 230).toString());
    if (this.cols === 0) {
      this.cols = 1
    }
    (document.getElementsByClassName("card-container") as HTMLCollectionOf<HTMLDivElement>)[0].style.columns = this.cols.toString();

    if (document.getElementsByClassName("wrapper")[0].clientWidth < 100 && !this.sidebarSmartphone) {
      setTimeout(() => {

        document.getElementById("sidebar").style.display = "flex";
      }, 100);
    }
  }

  getUserProducts(): any {
    this.cartRefresh = true;

    this.shopService.searchUserCart(this.user._id).subscribe(data => {
      this.myCart = data
      if (data.length === 0) {
        return this.getUserProducts();
      }
      this.userService.searchUserProducts(data[0]._id).subscribe(data2 => {
        this.cartItems = data2
        this.shopService.displayUserProducts(data2).subscribe(data3 => {
          this.myProducts = [];
          this.orderCost = 0;
          this.firstUse = false;
          for (var i: number = 0; i < this.cartItems.length; i++) {
            this.myProducts.push([this.cartItems[i], data3.userProd[i]])
            this.orderCost += this.myProducts[i][0].totalPrice
          }
          if(this.myProducts.length === i){
            this.cartRefresh = false;
          }
        });
      });
    });
  }

  delProd(ev: any): void | undefined {
    this.cartRefresh = true;
    this.shopService.deleteProd({ product: ev.target.id, cart: this.myCart[0]._id }).subscribe(data => { });
    this.myProducts = [];

    if (ev.target.parentElement.parentElement.children.length === 1) {
      this.cartRefresh = false;
      this.shopService.deleteCart(this.myCart[0]._id).subscribe(data => { });
      this.myCart = [];
      this.orderCost = 0;
      this.shopService.searchUserCart(this.user._id).subscribe(data => {
        this.myCart = data
        if (data.length === 0) {
          return;
        }
        this.userService.searchUserProducts(data[0]._id).subscribe(data2 => {
          this.cartItems = data2
          this.shopService.displayUserProducts(data2).subscribe(data3 => {
            this.myProducts = [];
            this.firstUse = false;
            for (let i: number = 0; i < this.cartItems.length; i++) {
              this.myProducts.push([this.cartItems[i], data3.userProd[i]])
              this.orderCost += this.myProducts[i][0].totalPrice
            }
          });
        });
      });
    }
    else {
      this.getUserProducts();
    }
  }

  discardCart(): void | undefined {
    if (confirm("are you sure? this will delete all of your cart's content")) {
      this.shopService.discardCart(this.myCart[0]._id).subscribe(data => {
      });
      this.shopService.searchUserCart(this.user._id).subscribe(data => {
        this.myCart = data
        if (data.length === 0) {
          this.myProducts = [];
          this.orderCost = 0;
          return;
        }
        this.userService.searchUserProducts(data[0]._id).subscribe(data2 => {
          this.cartItems = data2
          this.shopService.displayUserProducts(data2).subscribe(data3 => {
            this.myProducts = [];
            this.firstUse = false;
            for (let i: number = 0; i < this.cartItems.length; i++) {
              this.myProducts.push([this.cartItems[i], data3.userProd[i]])
              this.orderCost += this.myProducts[i][0].totalPrice
            }
          });
        });
      });
    }
  }

  goToOrder(): void {

    this.shopService.goToOrder({ myProducts: this.myProducts, orderCost: this.orderCost.toFixed(2), user: this.user, cart: this.myCart });
    this.router.navigate(['order']);
  }

  Boss_AddProduct(): void {
    this.submitted = true;
    if (this.addProduct.valid) {
      this.shopService.adminAdd({
        title: this.addProduct.controls.addProdTitle.value,
        description: this.addProduct.controls.addProdDescription.value,
        price: this.addProduct.controls.addProdPrice.value,
        type: this.addProduct.controls.addProdCategory.value,
        url: this.addProduct.controls.addProdImg.value
      }).subscribe(data => {
        if (data.title === this.addProduct.controls.addProdTitle.value) {
          this.adminAddmode = true;
          this.submitted = false;
          this.AdminEditMode = true;
          this.ngOnInit();
        }
      });
    }
  }


  ngOnInit(): void | undefined {
    this.onResize();
    (document.getElementsByTagName("body") as HTMLCollectionOf<HTMLBodyElement>)[0].style.overflow = "hidden";
    this.user = this.userService.user;
    if (this.user.role === "admin") {
      if (!this.AdminEditMode) {
        this.toggleSidebar();
        this.AdminEditMode = false;
      }
      else {
        setTimeout((): void => {
          this.reassignType();
        }, 100);
      }
    }
    setTimeout((): void => {
      this.userService.shopCompActive = true;
    }, 100);

    this.userService.categories().subscribe(assignCategory => {
      this.currentCategory = assignCategory.map((t: any): void => t)[0]._id;

      this.userService.getProducts().subscribe(getProductFromAssignedCategory => {
        this.products = getProductFromAssignedCategory.map(getProductFromAssignedCategory => getProductFromAssignedCategory);
        this.category = this.products.filter((categ: any): boolean => { return categ.type === this.currentCategory });
        var checkIfImageHasLoaded: any = () => {
          if (document.getElementsByClassName("card-image").length === this.category.length) {
            this.hasLoaded = 0;
            for (let i: number = 0; i < this.category.length; i++) {
              if ((document.getElementsByClassName("card-image")[i] as HTMLImageElement).height > 50) {
                this.hasLoaded = i
              }
              else setTimeout(() => {
                checkIfImageHasLoaded()
              }, 100);
            }
            if (this.hasLoaded === this.category.length - 1) {
              this.loadingProducts = false;
            }
            else setTimeout(() => {
              checkIfImageHasLoaded()
            }, 100);
          }
          else setTimeout(() => {
            checkIfImageHasLoaded()
          }, 100);
          debugger;
          if (!this.loadingCart && !this.loadingProducts) {
            debugger;
            this.loadingComplete = true;
          }
          else setTimeout(() => {
            checkIfImageHasLoaded()
          }, 100);
        }
        checkIfImageHasLoaded()
      });
    });

    this.shopService.searchUserCart(this.user._id).subscribe(data => {
      this.myCart = data
      if (data.length === 0) {
        debugger;
        this.loadingCart = false;
        return;
      }
      this.userService.searchUserProducts(data[0]._id).subscribe(data2 => {
        this.cartItems = data2
        this.shopService.displayUserProducts(data2).subscribe(data3 => {
          this.myProducts = [];
          this.firstUse = false;
          for (let i: number = 0; i < this.cartItems.length; i++) {
            this.myProducts.push([this.cartItems[i], data3.userProd[i]])
            this.orderCost += this.myProducts[i][0].totalPrice
          }
          this.loadingCart = false;
        });
      });
    });
  }
  ngOnDestroy(): void {
    this.userService.shopCompActive = false;
    (document.getElementsByTagName("body") as HTMLCollectionOf<HTMLBodyElement>)[0].style.overflow = "auto";
  }
}
